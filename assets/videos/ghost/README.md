# Ghost Editing Videos

Place exactly **3** showcase videos here:

- `ghost1.mp4`
- `ghost2.mp4`
- `ghost3.mp4`

## Instagram View Metrics

Only add metrics for videos that have real performance data. Edit `assets/videos.config.json`:

```json
"ghost1.mp4": { "metric": "4M+ Views" }
```

Leave `metric` empty or remove the entry if no verified number exists. **Never fabricate stats.**

Then run: `npm run generate-manifest`
