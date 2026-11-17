# Hosting migration — 17 November2026

User authorised GitHub hosting and Vercel links/cleanup in chat01a1e996-ea44-7fa2-8814-efad5ba881cb. GitHub Pages is live at https://ishaankothiyal-designer.github.io/Newsletter-X-Cars-24/. Existing Pages workflow continues production updates from main. All244published files match local/GitHub/Vercel release bytes;10suites pass against Pages, including162responsive widths and100dialog cases.

PR#3 added the isolated Vercel redirect root. Git integration is disconnected; outside-root files are excluded. Deleted12old newsletter deployments; kept original production dpl_783VpVBrUDkBeCmVxLKHJ96qFP5r. A redirect trial exposed root/trailing-slash matching issues and was rolled back to that original release;200responses verified. The explicit `^/(.*)$` rule replaces the generated wildcard and is verified in offline production build output.

Final Vercel link cutover remains blocked by `api-deployments-free-per-day`, more than100deployments, retry in24hours/1day. `node scripts/deploy-vercel-redirect.mjs` builds only redirect files in a temporary directory; `--deploy` uploads that prebuilt output after the allowance returns. Verify307Location and query preservation for root, index.html and versions/v8/, versions/v9/, versions/v10/ before deleting the original full-site deployment. No design, story content or reader runtime changed.
