import requests

API = "http://<IP_CLOUDSHELL>:<PORT>/set"

target = input("Target URL: ")
time = input("Durasi (detik): ")

res = requests.post(API, json={"target": target, "time": int(time)})
print("RESPON:", res.text)
