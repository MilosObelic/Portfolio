# Hosting this site on your Raspberry Pi 4B

The site is 100% static (HTML/CSS/JS + images), so all the Pi has to do is serve
files. nginx is perfect for this — it's tiny, fast, and rock solid on a Pi 4B.

Everything below is run **on the Pi** (SSH in, or use a keyboard/monitor).

---

## 1. Install nginx

```bash
sudo apt update
sudo apt install nginx -y
```

Check it works: open `http://<pi-ip-address>` in a browser on the same network —
you should see the nginx welcome page. (Find the Pi's IP with `hostname -I`.)

## 2. Copy the site onto the Pi

From your Windows PC, copy the whole `website` folder to the Pi. Easiest way is
`scp` from PowerShell (replace `pi` and the IP with yours):

```bash
scp -r F:\cv\website pi@192.168.1.XX:/home/pi/website
```

Then, on the Pi, move it to the web root:

```bash
sudo mkdir -p /var/www/cv
sudo cp -r /home/pi/website/* /var/www/cv/
sudo chown -R www-data:www-data /var/www/cv
```

## 3. Configure nginx

Create a site config:

```bash
sudo nano /etc/nginx/sites-available/cv
```

Paste this:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name www.stefanc.website stefanc.website;

    root /var/www/cv;
    index index.html;
    charset utf-8;

    error_page 404 /404.html;

    # compression (the site is all text + svg — this helps a lot on home upload speeds)
    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/xml text/plain;
    gzip_min_length 512;

    # security headers — the strict CSP works because the site loads nothing external
    add_header Content-Security-Policy "default-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'self'" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # cache: images/icons long, css/js shorter (so your edits show up within a day)
    location ~* \.(png|jpg|jpeg|gif|ico|svg|webp)$ {
        expires 7d;
        add_header Cache-Control "public";
    }
    location ~* \.(css|js)$ {
        expires 1d;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Enable it and disable the default page:

```bash
sudo ln -s /etc/nginx/sites-available/cv /etc/nginx/sites-enabled/cv
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t          # test the config — must say "ok"
sudo systemctl reload nginx
```

Now `http://<pi-ip-address>` shows **your** site on your local network.

## 4. Make it reachable from the internet

1. **Give the Pi a static local IP** — in your router's settings (DHCP
   reservation), pin the Pi to e.g. `192.168.1.50` so it never changes.
2. **Port forwarding** — in the router, forward external port **80** (and **443**
   for HTTPS later) to the Pi's local IP.
3. **Point your domain at the Pi** — you already own `stefanc.website`, and
   right now it points at GitHub Pages (the old portfolio). At your domain
   registrar's DNS settings:
   - **Delete** the records that point to GitHub Pages (a `CNAME` to
     `*.github.io` and/or A records to GitHub's IPs like `185.199.108.153`).
   - **Add** an `A` record for `@` (stefanc.website) → your home's public IP,
     and an `A` record (or `CNAME` to `stefanc.website`) for `www`.
   - Find your public IP at e.g. https://ifconfig.me — note this is your
     *home* IP, not the Pi's local `192.168.x.x`.
   - Also delete/empty the old GitHub Pages repo (or at least its CNAME file)
     so it doesn't fight you for the domain.
4. **Dynamic IP?** Most home connections change IP occasionally. Most
   registrars support *dynamic DNS* — a small cron job on the Pi keeps the
   DNS record pointed at your current home IP automatically. (If your
   registrar doesn't, Cloudflare's free DNS plan + their API does this well.)

> Heads-up: some ISPs block port 80/443 on home connections or use CGNAT
> (shared IPs). If port forwarding doesn't work, ask your ISP for a public IP,
> or use a free Cloudflare Tunnel as a fallback (`cloudflared`) — the site still
> lives on your Pi.

## 5. HTTPS (do this once the domain works)

Free certificate from Let's Encrypt, auto-renewing:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d stefanc.website -d www.stefanc.website
```

Certbot edits the nginx config for you and sets up renewal. Done — padlock in
the browser.

## 6. Updating the site later

Edit the files on your PC, then re-copy:

```bash
scp -r F:\cv\website\* pi@192.168.1.XX:/tmp/site && ssh pi@192.168.1.XX "sudo cp -r /tmp/site/* /var/www/cv/ && rm -rf /tmp/site"
```

(Or set up a git repo on the Pi and `git pull` — your call.)

## Keeping the Pi healthy

```bash
sudo apt update && sudo apt full-upgrade -y    # run now and then
sudo systemctl enable nginx                    # start on boot (default: on)
```

Optional but smart:
- `sudo apt install unattended-upgrades` — automatic security updates.
- `sudo apt install ufw && sudo ufw allow 22,80,443/tcp && sudo ufw enable` — firewall.
- Never expose SSH (port 22) to the internet unless you use key-based auth.
