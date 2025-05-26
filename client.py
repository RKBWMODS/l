package main

import (
    "bufio"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "strings"
)

const termuxLogo = `
████████████████████████████████████████████████████
█                                              █
█            TERMUX CLIENT                     █
█                                              █
████████████████████████████████████████████████████
`

type ProxyInfo struct {
    IP     string `json:"ip"`
    Port   int    `json:"port"`
    Status string `json:"status"`
    Link   string `json:"link"`
}

func main() {
    fmt.Println(termuxLogo)
    reader := bufio.NewReader(os.Stdin)

    fmt.Print("Masukkan LINK API Cloud Shell: ")
    apiLink, _ := reader.ReadString('\n')
    apiLink = strings.TrimSpace(apiLink)

    fmt.Print("Masukkan TARGET URL: ")
    targetURL, _ := reader.ReadString('\n')
    targetURL = strings.TrimSpace(targetURL)

    resp, err := http.Get(apiLink + "/get_proxy")
    if err != nil {
        fmt.Println("Gagal connect ke Cloud Shell:", err)
        return
    }
    defer resp.Body.Close()
    body, _ := ioutil.ReadAll(resp.Body)

    var proxy ProxyInfo
    if err := json.Unmarshal(body, &proxy); err != nil {
        fmt.Println("Gagal parsing response:", err)
        return
    }

    if proxy.Status != "200" {
        fmt.Println("Proxy tidak aktif:", proxy)
        return
    }

    fmt.Println("Proxy IP:", proxy.IP)
    fmt.Println("Proxy Port:", proxy.Port)
    fmt.Println("Proxy Link:", proxy.Link)

    client := &http.Client{}
    req, _ := http.NewRequest("GET", targetURL, nil)
    respTarget, err := client.Do(req)
    if err != nil {
        fmt.Println("Gagal request ke target:", err)
        return
    }
    defer respTarget.Body.Close()
    content, _ := ioutil.ReadAll(respTarget.Body)

    fmt.Println("Response dari target:", string(content))
}
