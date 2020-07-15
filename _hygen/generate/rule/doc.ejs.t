---
to: docs/rules/<%= name %>.md
---
# config-files/<%= name %>

## 📖 Rule Details

<%= description %>

### 👎

```ts
/*eslint config-files/<%= name %>: "error"*/

```

### 👍

```ts
/*eslint config-files/<%= name %>: "error"*/

```

## 🔧 Options

```json
{
  "rules": {
    "config-files/<%= name %>": [
      "error",
      { "prefer": "React.FC" }
    ]
  }
}
```

- `prefer` (`string`) ... Specify the type you prefer.
  - Default ... `""`
