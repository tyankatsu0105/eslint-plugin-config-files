---
to: docs/rules/<%= name %>.md
---
# config/<%= name %>

## 📖 Rule Details

<%= description %>

### 👎

```ts
/*eslint config/<%= name %>: "error"*/

```

### 👍

```ts
/*eslint config/<%= name %>: "error"*/

```

## 🔧 Options

```json
{
  "rules": {
    "config/<%= name %>": [
      "error",
      { "prefer": "React.FC" }
    ]
  }
}
```

- `prefer` (`string`) ... Specify the type you prefer.
  - Default ... `""`
