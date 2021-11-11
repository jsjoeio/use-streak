# Streak Counter

This is a basic streak counter - inspired by Duolingo - written in TypeScript and meant for the browser (uses `localStorage`).

## Usage

```typescript
const today = new Date()
const streak = useStreak(localStorage, today)
// streak returns an object:
// {
//    currentCount: 1,
//    lastLoginDate: "11/11/2021",
//    startDate: "11/11/2021",  
// } 
```

![screenshot of streak demo](./streak-demo.png | width=100)
## LICENSE

MIT. Just make sure you give acknowledgements to this repo.