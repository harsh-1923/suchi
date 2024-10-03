# Suchi

An open-source React library to create an Index (Table of Contents) for your page.

[text](https://suchidocs.in/)

[View Source](https://github.com/harsh-1923/suchi "View Source")
[Report an issue](https://github.com/harsh-1923/suchi/issues "Report an issue")
[View on npm](https://www.npmjs.com/package/suchi "View on npm")

https://github.com/user-attachments/assets/f5397abe-00f5-45b9-a0d5-d83b85f74a96

# Installation

```bash
npm i suchi
```

# Anatomy

```jsx
import Suchi from "suchi";

<Suchi.Root accentColor>
  <Suchi.Header></Suchi.Header>
  <Suchi.ReadTime />
  <Suchi.Section>
    <Suchi.SectionHeader />
    <Suchi.Content>
      <Suchi.Reference />
    </Suchi.Content>
  </Suchi.Section>
</Suchi.Root>;
```

# Contributions

Suchi is a open source project and you can contribute to Suchi by following our [Contributing Guidelines](https://github.com/harsh-1923/suchi/blob/main/README.md) or by [Reporting a Bug](https://github.com/harsh-1923/suchi/issues)
