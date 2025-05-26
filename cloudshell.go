package main

import (
    "encoding/json"
    "fmt"
    "io/ioutil"
    "math/rand"
    "net/http"
    "strconv"
    "strings"
    "time"
)

const cloudLogo = `
   ____ _                 ____ _                 
  / ___| | ___  ___  ___|  _ \ | ___   ___  _ __ 
 | |   | |/ _ \/ __|/ _ \ | | | |/ _ \ / _ \| '__|
 | |___| | (_) \__ \  __/ |_| | | (_) | (_) | |   
  \____|_|\___/|___/\___|____/|_|\___/ \___/|_|   
`

type ProxyInfo struct {
    IP     string `json:"ip"`
    Port   int    `json:"port"`
    Status string `json:"status"`
    Link   string `json:"link"`
}

func loadProxies(filename string) ([]string, error) {
    data, err := ioutil.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    lines := strings.Split(string(data), "\n")
    var proxies []string
    for _, line := range lines {
        line = strings.TrimSpace(line)
        if line != "" {
            proxies = append(proxies, line)
        }
    }
    return proxies, nil
}

func getPortFromProxy(proxy string) (int, error) {
    parts := strings.Split(proxy, ":")
    if len(parts) != 2 {
        return 0, fmt.Errorf("format proxy salah")
    }
    portStr := parts[1]
    port, err := strconv.Atoi(portStr)
    if err != nil {
        return 0, err
    }
    return port, nil
}

func checkProxy(proxy string) bool {
    client := &http.Client{
        Timeout: 3 * time.Second,
    }
    resp, err := client.Get("http://httpbin.org/get")
    if err != nil {
        return false
    }
    defer resp.Body.Close()
    return resp.StatusCode == 200
}

func getActiveProxy(proxies []string) (*ProxyInfo, error) {
    rand.Seed(time.Now().UnixNano())
    rand.Shuffle(len(proxies), func(i, j int) { proxies[i], proxies[j] = proxies[j], proxies[i] })

    for _, proxy := range proxies {
        if checkProxy(proxy) {
            ipPort := strings.Split(proxy, ":")
            ip := ipPort[0]
            port, _ := getPortFromProxy(proxy)
            link := fmt.Sprintf("https://%s:%d", ip, port)
            return &ProxyInfo{
                IP:     ip,
                Port:   port,
                Status: "200",
                Link:   link,
            }, nil
        }
    }
    return nil, fmt.Errorf("Tidak ada proxy aktif")
}

func getProxyHandler(w http.ResponseWriter, r *http.Request) {
    proxies, err := loadProxies("proxy.txt")
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"status": "fail", "error": err.Error()})
        return
    }

    proxyInfo, err := getActiveProxy(proxies)
    if err != nil {
        json.NewEncoder(w).Encode(map[string]string{"status": "fail", "error": "Tidak ada proxy aktif"})
        return
    }

    json.NewEncoder(w).Encode(proxyInfo)
}

type ExecuteRequest struct {
    TargetURL string `json:"target_url"`
}
type ExecuteResponse struct {
    Status       string `json:"status"`
    ResponseCode int    `json:"response_code,omitempty"`
    Content      string `json:"content,omitempty"`
    Error        string `json:"error,omitempty"`
}

func executeHandler(w http.ResponseWriter, r *http.Request) {
    var req ExecuteRequest
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        w.WriteHeader(http.StatusBadRequest)
        json.NewEncoder(w).Encode(ExecuteResponse{Status: "error", Error: err.Error()})
        return
    }
    client := &http.Client{Timeout: 10 * time.Second}
    resp, err := client.Get(req.TargetURL)
    if err != nil {
        json.NewEncoder(w).Encode(ExecuteResponse{Status: "error", Error: err.Error()})
        return
    }
    defer resp.Body.Close()
    bodyBytes, _ := ioutil.ReadAll(resp.Body)
    content := string(bodyBytes)
    if len(content) > 200 {
        content = content[:200]
    }
    json.NewEncoder(w).Encode(ExecuteResponse{
        Status:       "success",
        ResponseCode: resp.StatusCode,
        Content:      content,
    })
}

func main() {
    rand.Seed(time.Now().UnixNano())
    port := rand.Intn(50000) + 10000
    portStr := strconv.Itoa(port)

    fmt.Println(cloudLogo)
    fmt.Println("Server berjalan di port:", portStr)

    http.HandleFunc("/get_proxy", getProxyHandler)
    http.HandleFunc("/execute", executeHandler)

    if err := http.ListenAndServe(":" + portStr, nil); err != nil {
        fmt.Println("Error:", err)
    }
}
