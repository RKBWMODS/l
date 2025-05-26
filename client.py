import requests

api = input("MASUKAN API https://[api]:[port] : ")
target = input("MASUKAN TARGET : ")
durasi = int(input("MASUKAN DURASI : "))
API_KEY = "kunciraasamu123"

headers = {"x-api-key": API_KEY}
res = requests.post(f"{api}/set", json={"target": target, "time": durasi}, headers=headers)
print("RESPON:", res.text)
