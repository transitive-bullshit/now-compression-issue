# now-compression-issue

ZEIT now v2 with the Node.js runtime seems to silently fail handling any requests with `content-encoding` other than `identity`. The same requests work fine on `now dev`.

To repro, either use `https://now-compression-issue.now.sh` which is this repo deployed to `now` or deploy it yourself and update the `NOW_URL` environment variable respectively.

## Scenarios

In this version, no compression of the POST body is used and everything works as expected.

```bash
export NOW_URL=https://now-compression-issue.now.sh
node index.js
```

---

In this version, gzip compression of the POST body is used and ZEIT now silently fails without ever reaching our handler code or logging anything.

```bash
COMPRESSION=gzip node index.js
```

---

If you run `now dev` and point `NOW_URL` at that, then everything works as expected regardless of if you enable compression or not.

```
now dev&
export NOW_URL=http://localhost:3000
COMPRESSION=gzip node index.js
```

## License

MIT © [Saasify](https://saasify.sh)
