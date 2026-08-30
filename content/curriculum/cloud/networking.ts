import type { SeedPath } from "@/lib/curriculum/seed";

export const networkingPath: SeedPath = {
  title: "Cloud Networking",
  description:
    "Understand the network fundamentals every cloud engineer relies on: IP, DNS, HTTP, and the tools used to troubleshoot connectivity.",
  slug: "networking",
  modules: [
    {
      title: "Networking Basics",
      description: "IP addresses, DNS, HTTP, and the layered model.",
      slug: "basics",
      icon: "Network",
      units: [
        {
          title: "Addresses & Names",
          description: "How machines are addressed and named on the internet.",
          slug: "addresses-names",
          lessons: [
            {
              title: "IP Addresses",
              description: "IPv4, IPv6, and how addresses are split into networks.",
              slug: "ip-addresses",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the difference between IPv4 and IPv6",
                "Identify private vs public IP ranges",
                "Read CIDR notation like /24",
              ],
              skills: [
                { name: "ip-addressing", description: "Reason about IP addresses and CIDR blocks" },
              ],
              activities: [
                {
                  title: "The Address of a Machine",
                  body: "Every device on a network gets an **IP address**. IPv4 uses four octets like `192.168.1.10`; IPv6 uses eight groups of hex digits. **Private** ranges (`10.x`, `172.16-31.x`, `192.168.x`) never travel the public internet — NAT translates them at the edge. **CIDR** notation like `10.0.0.0/24` describes a block: the `/24` says the first 24 bits are the network portion.",
                },
                {
                  title: "Example",
                  body: "A subnet `10.0.1.0/24` covers addresses `10.0.1.1` through `10.0.1.254` — the `/24` fixes the first three octets (24 bits).",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "How many digits does an IPv4 address use per octet group?",
                  options: ["8 bits", "16 bits", "4 bits", "32 bits"],
                  correctAnswer: "8 bits",
                  explanation:
                    "IPv4 has four octets of 8 bits each, e.g. 192.168.1.10. In total that is 32 bits.",
                },
                {
                  type: "multi_select",
                  difficulty: "beginner",
                  question: "Which of the following are private IPv4 ranges?",
                  multiSelectOptions: [
                    { text: "192.168.0.0/16", isCorrect: true },
                    { text: "10.0.0.0/8", isCorrect: true },
                    { text: "8.8.8.8", isCorrect: false },
                    { text: "172.16.0.0/12", isCorrect: true },
                    { text: "1.1.1.1", isCorrect: false },
                  ],
                  explanation:
                    "Private ranges are 10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16. 8.8.8.8 and 1.1.1.1 are public DNS servers.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A /24 CIDR block contains exactly 256 host addresses, minus network and broadcast addresses.",
                  correctAnswer: "true",
                  explanation:
                    "/24 fixes 24 bits, leaving 8 bits = 256 addresses. Two are reserved (network and broadcast), leaving 254 usable.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "In the CIDR block 10.0.0.0/24, the first 24 bits are the network portion and the remaining ___ bits are the host portion.",
                  fillBlanks: [{ answer: "8" }],
                  explanation:
                    "32 total bits minus 24 network bits leaves 8 host bits.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question:
                    "Type the command that shows your machine's IP addresses (the interface configuration).",
                  correctAnswer: "ip addr|ipconfig|ifconfig",
                  explanation:
                    "On Linux, ip addr (or ifconfig) shows interfaces and their addresses; Windows uses ipconfig.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "A new server is placed in the 10.0.3.0/24 subnet and you need to confirm it actually received an address from that range.",
                  parts: [
                    {
                      prompt:
                        "Type the command that lists all network interfaces and their IP addresses.",
                      correctAnswer: "ip addr|ifconfig",
                    },
                    {
                      prompt:
                        "You see the address 10.0.3.9/24. Type the CIDR-notation subnet it belongs to.",
                      correctAnswer: "10.0.3.0/24",
                    },
                    {
                      prompt:
                        "Type the command that verifies connectivity to a host named gateway.local.",
                      correctAnswer: "ping gateway.local",
                    },
                  ],
                  explanation:
                    "ip addr shows the address, 10.0.3.9/24 pins it to 10.0.3.0/24, and a successful ping confirms the link.",
                },
              ],
            },
            {
              title: "DNS Explained",
              description: "How domain names resolve to IP addresses.",
              slug: "dns-explained",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain the role of DNS records",
                "Identify A, CNAME, and MX records",
                "Use dig to inspect DNS",
              ],
              skills: [
                { name: "dns", description: "Resolve names and read DNS records" },
              ],
              activities: [
                {
                  title: "The Phonebook of the Internet",
                  body: "**DNS** turns names like `api.example.com` into IP addresses. An **A record** maps a name to an IPv4 address; **AAAA** to IPv6; a **CNAME** aliases one name to another; **MX** declares the mail server. Cloud apps often use CNAMEs so a hostname can point at a load balancer or CDN without changing the name.",
                },
                {
                  title: "Try it",
                  body: "`dig api.example.com` prints the resolved address (the ANSWER section). Compare `dig` against the much faster cached lookups you get with `getent hosts api.example.com`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which DNS record maps a name directly to an IPv4 address?",
                  options: ["A", "CNAME", "MX", "TXT"],
                  correctAnswer: "A",
                  explanation:
                    "An A record maps a hostname to an IPv4 address; AAAA does the same for IPv6.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each DNS record type to what it does.",
                  matchPairs: [
                    { left: "A", right: "Name to IPv4" },
                    { left: "AAAA", right: "Name to IPv6" },
                    { left: "CNAME", right: "Alias to another name" },
                    { left: "MX", right: "Mail server" },
                  ],
                  explanation:
                    "A/AAAA answer directly with addresses, CNAME creates an alias, and MX directs email delivery.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "A CNAME record points a hostname at another hostname rather than an IP address.",
                  correctAnswer: "true",
                  explanation:
                    "CNAMEs create aliases — useful when a service's IP can change (e.g. behind a load balancer).",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question:
                    "Type the command that looks up the IP address for the host api.example.com.",
                  correctAnswer: "dig api.example.com|nslookup api.example.com|host api.example.com",
                  explanation:
                    "dig, nslookup, and host all query DNS and print the resolved addresses.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a typical DNS lookup for a cached name.",
                  sequenceItems: [
                    { id: "cache", text: "Browser checks its local DNS cache" },
                    { id: "resolver", text: "Cache miss → question the configured resolver" },
                    { id: "root", text: "Resolver walks the root and TLD servers" },
                    { id: "authoritative", text: "Authoritative server returns the A record" },
                  ],
                  sequenceCorrectOrder: ["cache", "resolver", "root", "authoritative"],
                  explanation:
                    "Caches are checked first, then the resolver walks root → TLD → authoritative to fetch the answer.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A ___ record lets you point www.example.com at example.com without owning a separate IP.",
                  fillBlanks: [{ answer: "CNAME" }],
                  explanation:
                    "CNAME aliases one name to another, so you only manage one canonical address.",
                },
              ],
            },
            {
              title: "HTTP Fundamentals",
              description: "Methods, status codes, and headers.",
              slug: "http-fundamentals",
              estimatedMinutes: 7,
              learningObjectives: [
                "Describe HTTP methods GET, POST, PUT, DELETE",
                "Interpret status codes by class",
                "Read common request and response headers",
              ],
              skills: [
                { name: "http", description: "Work with HTTP requests and responses" },
              ],
              activities: [
                {
                  title: "The Request/Response Loop",
                  body: "An HTTP client sends a **request** — method, path, headers, optional body — and the server replies with a **status code** and headers. Methods: `GET` reads, `POST` creates, `PUT` replaces, `DELETE` removes. Status classes: `2xx` success, `3xx` redirect, `4xx` client error, `5xx` server error. Headers like `Content-Type`, `Authorization`, and `Cache-Control` carry metadata.",
                },
                {
                  title: "Example",
                  body: "`curl -i https://api.example.com/health` sends a GET and prints the response headers plus the raw status line — a cloud engineer's everyday check.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which HTTP method is meant to create a new resource on the server?",
                  options: ["GET", "POST", "PUT", "DELETE"],
                  correctAnswer: "POST",
                  explanation:
                    "POST creates resources, GET reads, PUT replaces, and DELETE removes.",
                },
                {
                  type: "match",
                  difficulty: "beginner",
                  question: "Match each status code class to its meaning.",
                  matchPairs: [
                    { left: "2xx", right: "Success" },
                    { left: "3xx", right: "Redirection" },
                    { left: "4xx", right: "Client error" },
                    { left: "5xx", right: "Server error" },
                  ],
                  explanation:
                    "2xx success, 3xx redirect, 4xx the client sent something wrong, 5xx the server failed.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question: "A 404 status code means the requested resource was not found.",
                  correctAnswer: "true",
                  explanation:
                    "404 Not Found is a 4xx client error — the resource does not exist (or is hidden).",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question:
                    "Type the command that sends a GET request and prints only the HTTP status code.",
                  correctAnswer: "curl -o /dev/null -s -w '%{http_code}' https://api.example.com|curl -o /dev/null -w '%{http_code}' https://api.example.com",
                  explanation:
                    "curl -w prints a custom format; %{http_code} yields just the status. -o /dev/null discards the body and -s silences progress.",
                },
                {
                  type: "scenario",
                  difficulty: "intermediate",
                  question:
                    "A deployment script keeps getting errors and you need to reproduce the failing API call by hand.",
                  parts: [
                    {
                      prompt:
                        "Type the command that sends a GET to https://api.example.com/health and prints the response headers.",
                      correctAnswer: "curl -i https://api.example.com/health",
                    },
                    {
                      prompt:
                        "The response status is 503. Type the two-letter status class that tells you the server is overloaded.",
                      correctAnswer: "5xx",
                    },
                    {
                      prompt:
                        "Type the curl flag that follows redirects if the endpoint returns a 3xx.",
                      correctAnswer: "-L",
                    },
                  ],
                  explanation:
                    "-i shows headers, 503 is a 5xx server-side error, and -L makes curl follow 3xx redirects automatically.",
                },
                {
                  type: "code_completion",
                  difficulty: "advanced",
                  codeLanguage: "bash",
                  question:
                    "Complete the curl command so it prints the HTTP status code using the %{http_code} format token: curl -s -o /dev/null -w {{code}} https://api.example.com",
                  codeBlanks: [{ id: "code", answer: "'%{http_code}'", placeholder: "format" }],
                  explanation:
                    "The -w flag expects a format string; %{http_code} expands to the numeric status code.",
                },
              ],
            },
          ],
        },
        {
          title: "The OSI Model",
          description: "Understand the layers of networking.",
          slug: "osi-model",
          lessons: [
            {
              title: "Layers and Packets",
              description: "Physical, data link, network, transport, and application.",
              slug: "layers",
              estimatedMinutes: 6,
              learningObjectives: [
                "Name the OSI layers relevant to cloud: L2-L7",
                "Explain TCP vs UDP",
                "Map protocols like HTTP, DNS, and TLS to layers",
              ],
              skills: [
                { name: "osi-layers", description: "Place protocols in the network stack" },
              ],
              activities: [
                {
                  title: "The Network Stack",
                  body: "A simplified stack: **L2 data link** (Ethernet, MAC addresses), **L3 network** (IP routing), **L4 transport** (TCP/UDP with ports), **L5-7 application** (HTTP, DNS, TLS). Cloud load balancers are L4 (forward by IP + port) or L7 (inspect HTTP paths and headers). **TCP** is connection-oriented and reliable; **UDP** is fast and lossy — perfect for DNS and video.",
                },
                {
                  title: "Why It Matters",
                  body: "Diagnosing 'is it the network or the app?' usually means checking L4 connectivity first (can I reach the port?) before blaming L7 (the HTTP error).",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "TCP and UDP operate at which layer?",
                  options: ["Transport (L4)", "Network (L3)", "Data link (L2)", "Application (L7)"],
                  correctAnswer: "Transport (L4)",
                  explanation:
                    "L4 transport carries TCP and UDP segments, identified by ports.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which protocols rely on UDP rather than TCP?",
                  multiSelectOptions: [
                    { text: "DNS queries", isCorrect: true },
                    { text: "Streaming video", isCorrect: true },
                    { text: "Web browsing (HTTP)", isCorrect: false },
                    { text: "Email (SMTP)", isCorrect: false },
                  ],
                  explanation:
                    "DNS and real-time media prefer UDP: small, fast, lossy. HTTP and SMTP need TCP's reliability.",
                },
                {
                  type: "true_false",
                  difficulty: "beginner",
                  question:
                    "An L7 load balancer can route requests based on the URL path, not only the IP and port.",
                  correctAnswer: "true",
                  explanation:
                    "L7 load balancers read the HTTP request and can route by path, hostname, or header.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each technology to its network layer.",
                  matchPairs: [
                    { left: "HTTP", right: "L7" },
                    { left: "IP", right: "L3" },
                    { left: "Ethernet/MAC", right: "L2" },
                    { left: "TCP port 443", right: "L4" },
                  ],
                  explanation:
                    "HTTP is application (L7), IP routes at L3, Ethernet uses MACs at L2, and TCP ports live at L4.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "The ___ handshake (SYN, SYN-ACK, ACK) establishes a reliable TCP connection.",
                  fillBlanks: [{ answer: "three-way" }],
                  explanation:
                    "TCP opens connections with the three-way handshake: SYN → SYN-ACK → ACK.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Troubleshooting Tools",
      description: "Ping, traceroute, dig, curl, and netstat in action.",
      slug: "troubleshooting",
      icon: "Wrench",
      units: [
        {
          title: "Connectivity Tools",
          description: "Verify links, routes, and open ports.",
          slug: "connectivity-tools",
          lessons: [
            {
              title: "ping and traceroute",
              description: "Verify connectivity and trace the path.",
              slug: "ping-traceroute",
              estimatedMinutes: 6,
              learningObjectives: [
                "Use ping to test reachability and latency",
                "Trace route with traceroute",
                "Interpret timeouts and loss",
              ],
              skills: [
                { name: "connectivity-basics", description: "Test connectivity with ping and traceroute" },
              ],
              activities: [
                {
                  title: "Is It Reachable?",
                  body: "`ping host` sends ICMP echo requests and reports round-trip time and packet loss. `traceroute host` shows every hop between you and the target — invaluable when traffic dies mid-path. In cloud VPCs, ping failures usually mean a security group or firewall rule is blocking ICMP.",
                },
                {
                  title: "Example",
                  body: "`ping -c 4 database.internal` sends exactly four probes — handy in scripts where you do not want an infinite stream.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which protocol does ping use to test reachability?",
                  options: ["ICMP", "TCP", "UDP", "HTTP"],
                  correctAnswer: "ICMP",
                  explanation:
                    "ping sends ICMP echo-request packets and expects echo-replies.",
                },
                {
                  type: "command",
                  difficulty: "beginner",
                  question:
                    "Type the command that sends 4 ping probes to the host db.internal.",
                  correctAnswer: "ping -c 4 db.internal",
                  explanation:
                    "-c 4 limits the count to four probes, which is friendly to logs and scripts.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question:
                    "Type the command that traces every network hop between you and web.internal.",
                  correctAnswer: "traceroute web.internal|tracert web.internal",
                  explanation:
                    "traceroute (tracert on Windows) lists each hop with its latency.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A ping timeout to a cloud VM always means the VM is offline.",
                  correctAnswer: "false",
                  explanation:
                    "Security groups and firewalls often drop ICMP, so a timeout does not prove the machine is down — try a TCP check.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "A 100% ___ rate from ping means no echo replies came back at all.",
                  fillBlanks: [{ answer: "loss" }],
                  explanation:
                    "100% loss means every probe timed out — the host is unreachable or blocking ICMP.",
                },
              ],
            },
            {
              title: "Ports and Connections",
              description: "Use netstat and ss to inspect open ports.",
              slug: "ports-and-connections",
              estimatedMinutes: 6,
              learningObjectives: [
                "List listening ports with netstat and ss",
                "Identify established connections",
                "Confirm a service is bound to the right interface",
              ],
              skills: [
                { name: "port-inspection", description: "Inspect listening ports and connections" },
              ],
              activities: [
                {
                  title: "What Is Listening?",
                  body: "`netstat -tulpn` (or `ss -tulpn`) shows listening TCP/UDP ports and the process behind them. **The classic cloud gotcha:** your app listens on `127.0.0.1:3000`, but a load balancer on another host connects to the private IP — so `ss -tulpn` shows nothing on the public interface and the health check fails.",
                },
                {
                  title: "Example",
                  body: "`ss -tulpn | grep 3000` confirms whether anything is actually bound to port 3000 and to which address.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which command lists listening ports with the processes behind them?",
                  options: ["ss -tulpn", "ls -l", "df -h", "top"],
                  correctAnswer: "ss -tulpn",
                  explanation:
                    "ss (or netstat) with -tulpn lists TCP and UDP listening sockets and process names (as root).",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question:
                    "Type the command that lists listening sockets and filters for port 3306 (MySQL).",
                  correctAnswer: "ss -tulpn | grep 3306|netstat -tulpn | grep 3306",
                  explanation:
                    "Piping ss output through grep narrows it to lines mentioning the port.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A service bound only to 127.0.0.1 is reachable from other machines on the network.",
                  correctAnswer: "false",
                  explanation:
                    "127.0.0.1 is loopback — only local processes can connect. Bind to 0.0.0.0 or the private IP for remote access.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each tool to what it inspects.",
                  matchPairs: [
                    { left: "ss", right: "Open sockets/ports" },
                    { left: "ip route", right: "Routing table" },
                    { left: "curl", right: "HTTP endpoint" },
                    { left: "dig", right: "DNS records" },
                  ],
                  explanation:
                    "ss shows sockets, ip route shows routes, curl hits HTTP, and dig queries DNS.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question:
                    "A load balancer reports your app unhealthy. Order the most efficient debug sequence.",
                  sequenceItems: [
                    { id: "port", text: "Check the port is listening: ss -tulpn" },
                    { id: "bind", text: "Verify it binds 0.0.0.0, not 127.0.0.1" },
                    { id: "local", text: "Test locally: curl http://localhost:8080/health" },
                    { id: "remote", text: "Test from another host on the private network" },
                    { id: "sg", text: "Review the security group / firewall rules" },
                  ],
                  sequenceCorrectOrder: ["port", "bind", "local", "remote", "sg"],
                  explanation:
                    "Confirm the port, check the bind address, test locally, then from the network, then fix the firewall.",
                },
              ],
            },
            {
              title: "curl in Depth",
              description: "Headers, verbosity, and API debugging.",
              slug: "curl-in-depth",
              estimatedMinutes: 7,
              learningObjectives: [
                "Inspect HTTP headers with curl -i",
                "Send custom methods, headers, and bodies",
                "Debug TLS with -v and -k",
              ],
              skills: [
                { name: "curl", description: "Exercise HTTP APIs from the CLI" },
              ],
              activities: [
                {
                  title: "Swiss Army Knife",
                  body: "`curl -i URL` prints response headers. `-X POST` sets the method, `-H 'Authorization: Bearer …'` adds a header, `-d '{\"key\":\"value\"}'` sends a body. `-v` shows the full TLS handshake and request/response in detail. For a self-signed test server, `-k` skips certificate verification (only for scratch work — never bypass TLS checks in production debugging).",
                },
                {
                  title: "Example",
                  body: "`curl -s -X POST -H 'Content-Type: application/json' -d '{\"name\":\"quiz\"}' https://api.example.com/items` creates a JSON item.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which curl flag prints the response headers as well as the body?",
                  options: ["-i", "-o", "-s", "-L"],
                  correctAnswer: "-i",
                  explanation:
                    "-i includes the response headers in the output; -o writes to a file, -s silences progress, -L follows redirects.",
                },
                {
                  type: "command",
                  difficulty: "intermediate",
                  question:
                    "Type the command that POSTs JSON {\"name\":\"demo\"} to https://api.example.com/items.",
                  correctAnswer:
                    "curl -X POST -H 'Content-Type: application/json' -d '{\"name\":\"demo\"}' https://api.example.com/items",
                  explanation:
                    "-X POST sets the method, the Content-Type header declares JSON, and -d sends the body.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Using curl -k against an internal endpoint is safe for production debugging.",
                  correctAnswer: "false",
                  explanation:
                    "-k disables certificate verification and defeats TLS — only use it on throwaway test servers.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The curl flag that follows HTTP redirects (3xx) automatically is ___.",
                  fillBlanks: [{ answer: "-L" }, { answer: "--location" }],
                  explanation:
                    "-L (--location) makes curl re-issue the request at the redirect target.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each curl flag to its purpose.",
                  matchPairs: [
                    { left: "-v", right: "Verbose (TLS + request dump)" },
                    { left: "-H", right: "Add a header" },
                    { left: "-s", right: "Silent (no progress)" },
                    { left: "-o /dev/null", right: "Discard the body" },
                  ],
                  explanation:
                    "-v verbosity, -H headers, -s silence, -o writes output somewhere (here, nowhere).",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      title: "Network Security",
      description: "TLS, firewalls, proxies, and load balancers.",
      slug: "security",
      icon: "Shield",
      units: [
        {
          title: "Encryption & Entry",
          description: "TLS, WAFs, proxies, and load balancers.",
          slug: "encryption-entry",
          lessons: [
            {
              title: "TLS and Certificates",
              description: "HTTPS, certs, and certificate chains.",
              slug: "tls-certificates",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain what TLS encrypts and authenticates",
                "Describe the role of a certificate authority",
                "Verify a certificate with openssl",
              ],
              skills: [
                { name: "tls", description: "Reason about HTTPS, certs, and trust" },
              ],
              activities: [
                {
                  title: "Trust in Layers",
                  body: "**TLS** encrypts traffic between client and server (that is what the `s` in HTTPS means) and authenticates the server via its **certificate**. A **certificate authority (CA)** signs certs, and clients trust the CA, forming a chain: leaf → intermediate → root. Cloud services (ALB/NGINX/TLS termination) hold a private key plus the signed cert and terminate TLS before routing plaintext internally.",
                },
                {
                  title: "Try it",
                  body: "`openssl s_client -connect api.example.com:443 -servername api.example.com` prints the server's certificate chain — great for checking expiry or SAN names.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which protocol does HTTPS use to encrypt traffic?",
                  options: ["TLS", "DNS", "TCP", "ICMP"],
                  correctAnswer: "TLS",
                  explanation:
                    "HTTPS runs HTTP over TLS (formerly SSL), which encrypts and authenticates the connection.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which of these are valid reasons to check a server's TLS certificate?",
                  multiSelectOptions: [
                    { text: "It may have expired", isCorrect: true },
                    { text: "Its SAN may not cover the hostname", isCorrect: true },
                    { text: "To see the client's password", isCorrect: false },
                    { text: "To confirm it was issued by a trusted CA", isCorrect: true },
                  ],
                  explanation:
                    "Expiry, SAN coverage, and the issuing CA determine whether clients will trust the cert.",
                },
                {
                  type: "sequence",
                  difficulty: "intermediate",
                  question: "Order the steps of a browser connecting to https://api.example.com.",
                  sequenceItems: [
                    { id: "resolve", text: "Resolve api.example.com via DNS" },
                    { id: "tcp", text: "Open a TCP connection on port 443" },
                    { id: "handshake", text: "TLS handshake with certificate" },
                    { id: "verify", text: "Verify the cert chain against trusted CAs" },
                    { id: "http", text: "Send encrypted HTTP requests" },
                  ],
                  sequenceCorrectOrder: ["resolve", "tcp", "handshake", "verify", "http"],
                  explanation:
                    "DNS first, then TCP, then the TLS handshake, certificate verification, and finally encrypted HTTP.",
                },
                {
                  type: "command",
                  difficulty: "advanced",
                  question:
                    "Type the command that prints the TLS certificate presented by api.example.com on port 443.",
                  correctAnswer:
                    "openssl s_client -connect api.example.com:443 -servername api.example.com",
                  explanation:
                    "openssl s_client connects and dumps the handshake, including the server certificate.",
                },
                {
                  type: "fill_blank",
                  difficulty: "beginner",
                  question:
                    "The ___ service signs certificates so clients can trust a server's identity.",
                  fillBlanks: [{ answer: "certificate authority" }, { answer: "CA" }],
                  explanation:
                    "A certificate authority signs and vouches for certificates, forming the chain of trust.",
                },
              ],
            },
            {
              title: "Firewalls and Security Groups",
              description: "Screening incoming and outgoing traffic.",
              slug: "firewalls-security-groups",
              estimatedMinutes: 6,
              learningObjectives: [
                "Explain default-deny firewall rules",
                "Compare security groups and firewalls",
                "Design allow rules for web and DB tiers",
              ],
              skills: [
                { name: "firewalls", description: "Design restrictive traffic rules" },
              ],
              activities: [
                {
                  title: "Default Deny",
                  body: "A **firewall** filters traffic by IP, port, and protocol. Cloud **security groups** are stateful default-deny: if no rule allows a connection, it is dropped. Best practice is *least privilege* — allow only what is needed: the app tier only accepts 443 from the internet, the DB tier only accepts 3306 from the app subnet.",
                },
                {
                  title: "Example",
                  body: "A common web-tier rule: allow `0.0.0.0/0` on `TCP 443` (HTTPS) and `TCP 80` (HTTP). A database rule instead scopes to the app subnet CIDR, e.g. `10.0.1.0/24`.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "What does 'default-deny' mean for a firewall?",
                  options: [
                    "All traffic is allowed unless a rule says otherwise",
                    "All traffic is blocked unless a rule allows it",
                    "Only ICMP is allowed by default",
                    "Traffic is blocked after midnight",
                  ],
                  correctAnswer: "All traffic is blocked unless a rule allows it",
                  explanation:
                    "Default-deny starts by blocking everything; explicit allow rules whitelist specific traffic.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "Security groups are stateful, so a rule allowing outbound traffic also permits the matching reply.",
                  correctAnswer: "true",
                  explanation:
                    "Stateful security groups automatically allow return traffic for established connections.",
                },
                {
                  type: "multi_select",
                  difficulty: "intermediate",
                  question: "Which rules follow the least-privilege principle for a database tier?",
                  multiSelectOptions: [
                    { text: "Only the app subnet can reach TCP 3306", isCorrect: true },
                    { text: "Allow 0.0.0.0/0 on TCP 3306", isCorrect: false },
                    { text: "No inbound access from the public internet", isCorrect: true },
                    { text: "Allow SSH from your office IP only", isCorrect: true },
                  ],
                  explanation:
                    "Least privilege scopes the DB to the app subnet, keeps it off the public internet, and restricts SSH to admins.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each tier to the sensible inbound rule.",
                  matchPairs: [
                    { left: "Web tier", right: "0.0.0.0/0 on TCP 443" },
                    { left: "App tier", right: "Web subnet on app port" },
                    { left: "Database", right: "App subnet on TCP 3306" },
                    { left: "Admin bastion", right: "Office IP on TCP 22" },
                  ],
                  explanation:
                    "Expose only what each tier needs and scope sources to the smallest required range.",
                },
                {
                  type: "sequence",
                  difficulty: "advanced",
                  question: "Order the troubleshooting steps when a web server is unreachable from the internet.",
                  sequenceItems: [
                    { id: "public", text: "Confirm the instance has a public/elastic IP" },
                    { id: "sg", text: "Check the security group allows TCP 443 from 0.0.0.0/0" },
                    { id: "listening", text: "Verify the service listens on 0.0.0.0:443" },
                    { id: "local", text: "Test locally with curl on the instance" },
                    { id: "routes", text: "Check routing and internet gateway" },
                  ],
                  sequenceCorrectOrder: ["public", "listening", "local", "sg", "routes"],
                  explanation:
                    "Confirm addressing, then the listener, local reachability, the security group, then routing.",
                },
              ],
            },
            {
              title: "Load Balancers and Proxies",
              description: "Distributing traffic across backends.",
              slug: "load-balancers",
              estimatedMinutes: 7,
              learningObjectives: [
                "Explain L4 and L7 load balancing",
                "Describe health checks and session affinity",
                "Identify uses for forward and reverse proxies",
              ],
              skills: [
                { name: "load-balancing", description: "Distribute traffic across backends" },
              ],
              activities: [
                {
                  title: "The Front Door",
                  body: "A **load balancer** sits in front of your instances, forwarding traffic to healthy backends and taking unhealthy ones out via **health checks**. L4 balancers forward by IP/port; L7 balancers read HTTP headers — path-based routing (`/api` → app, `/images` → CDN) is an L7 superpower. A **reverse proxy** (NGINX) buffers and multiplexes the same traffic; a **forward proxy** is what your laptop uses to reach the internet.",
                },
                {
                  title: "Example",
                  body: "Sticky sessions (session affinity) pin a client to one backend by cookie. Stateless apps disable it — with multiple replicas, any backend can serve any request.",
                },
              ],
              questions: [
                {
                  type: "mcq",
                  difficulty: "beginner",
                  question: "Which type of load balancer routes traffic based on the URL path?",
                  options: ["L7", "L4", "L2", "L0"],
                  correctAnswer: "L7",
                  explanation:
                    "L7 (application) load balancers inspect HTTP and can route by path, hostname, or headers. L4 just forwards IP + port.",
                },
                {
                  type: "true_false",
                  difficulty: "intermediate",
                  question:
                    "A load balancer automatically stops sending traffic to a backend that fails its health check.",
                  correctAnswer: "true",
                  explanation:
                    "Health checks determine which backends are eligible; failed backends are removed until they recover.",
                },
                {
                  type: "multi_select",
                  difficulty: "advanced",
                  question: "Which of these are sensible reasons behind an L7 load balancer?",
                  multiSelectOptions: [
                    { text: "Terminate TLS so backends stay internal", isCorrect: true },
                    { text: "Route /api to one service and /static to another", isCorrect: true },
                    { text: "Encrypt traffic between the instances themselves", isCorrect: false },
                    { text: "Distribute requests across a fleet of app instances", isCorrect: true },
                  ],
                  explanation:
                    "L7 balancers terminate TLS, route by path, and distribute work. Encryption between backends is a separate concern.",
                },
                {
                  type: "match",
                  difficulty: "intermediate",
                  question: "Match each term to its role.",
                  matchPairs: [
                    { left: "Health check", right: "Probes a backend's readiness" },
                    { left: "Sticky session", right: "Pins a client to one backend" },
                    { left: "Reverse proxy", right: "Fronts your servers" },
                    { left: "Forward proxy", right: "Mediates clients' outbound traffic" },
                  ],
                  explanation:
                    "Health checks judge readiness, sticky sessions pin clients, reverse proxies face your backends, forward proxies mediate clients' egress.",
                },
                {
                  type: "fill_blank",
                  difficulty: "intermediate",
                  question:
                    "A health check that returns ___ and fails three times marks the backend unhealthy.",
                  fillBlanks: [{ answer: "500" }, { answer: "5xx" }, { answer: "503" }],
                  explanation:
                    "A 5xx (or any configured failure threshold) means the backend is not ready and will be drained.",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};