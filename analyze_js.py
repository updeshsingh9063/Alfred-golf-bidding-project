import os
import re

js_dir = r'd:\subscription golf lottery platform\frontend\assets'
js_files = [f for f in os.listdir(js_dir) if f.endswith('.js')]
js_files.sort(key=lambda f: os.path.getsize(os.path.join(js_dir, f)), reverse=True)
with open(os.path.join(js_dir, js_files[0]), 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Extract backtick paths
routes_bt = re.findall(r'path:`([^`]+)`', content)
routes_sq = re.findall(r"path:'([^']+)'", content)
routes_dq = re.findall(r'path:"([^"]+)"', content)

all_routes = routes_bt + routes_sq + routes_dq
print('=== ROUTES ===')
seen = set()
for r in all_routes:
    if r not in seen and '/' in r:
        seen.add(r)
        print(r)

# Extract component names (backtick style minified)
# Look for createElement patterns
funcs = re.findall(r'\bfunction ([a-zA-Z_$][a-zA-Z0-9_$]{3,})\b', content)
print('\n=== NAMED FUNCTIONS (uppercase = components) ===')
seen2 = set()
for f_name in funcs:
    if f_name[0].isupper() and f_name not in seen2 and len(f_name) > 3:
        seen2.add(f_name)
        print(f_name)

# Look for navigation links
nav_links = re.findall(r'to:`([^`]+)`', content)
nav_links += re.findall(r"to:'([^']+)'", content)
nav_links += re.findall(r'to:"([^"]+)"', content)
print('\n=== NAVIGATION LINKS (to=) ===')
seen3 = set()
for l in nav_links:
    if l not in seen3:
        seen3.add(l)
        print(l)

# Look for API base URL or fetch patterns
api_hints = re.findall(r'(?:baseURL|apiUrl|API_URL|VITE_API)[^,\s;]{0,100}', content)
print('\n=== API HINTS ===')
for h in api_hints[:10]:
    print(h[:100])

# Look for page titles / heading text
headings = re.findall(r'children:`([^`]{3,60})`', content)
print('\n=== PAGE CONTENT (children strings) ===')
seen4 = set()
for h in headings:
    if h not in seen4 and not h.startswith('--') and '\n' not in h:
        seen4.add(h)
        print(h)
