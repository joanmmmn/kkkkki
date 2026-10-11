# Recoge sugerencias de autocompletado de YouTube (ds=yt) y Google para una lista de semillas y países.
# Uso: python3 tools/seo/suggest.py "semilla 1|semilla 2" 1   (1 = añadir a–z a cada semilla) > sugerencias.json
import json, ssl, time, urllib.parse, urllib.request, sys, collections
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
def get(q, gl, yt):
    u = 'https://suggestqueries.google.com/complete/search?client=firefox&hl=es&gl=%s&q=%s%s' % (gl, urllib.parse.quote(q), '&ds=yt' if yt else '')
    for _ in range(3):
        try:
            with urllib.request.urlopen(u, context=ctx, timeout=10) as r:
                return json.loads(r.read().decode('utf-8', 'replace'))[1]
        except Exception as e:
            time.sleep(1)
    return []
seeds = sys.argv[1].split('|')
alpha = sys.argv[2] == '1'
countries = ['es', 'mx', 'co', 'ar', 'us']
out = collections.defaultdict(set)
for s in seeds:
    qs = [s] + ([s + ' ' + c for c in 'abcdefghijklmnopqrstuvwxyz'] if alpha else [])
    for q in qs:
        for gl in countries:
            for yt in (True, False):
                for sug in get(q, gl, yt):
                    out[sug].add(('YT' if yt else 'G') + ':' + gl)
        time.sleep(0.05)
json.dump({k: sorted(v) for k, v in out.items()}, sys.stdout, ensure_ascii=False, indent=0)
