# lerna-atlas

Small tool for generating a list of packages in Lerna monorepo readme file.

```
npm install -g lerna-atlas
```

1. Add the following lines to your `README.md` file:

```markdown
<!--- LERNA_PACKAGES --->
<!--- /LERNA_PACKAGES --->
```

2. In terminal, run the following command:

```
lerna-atlas
```

3. You can optionally specify other readme file:

```
lerna-atlas -s source/readme.md -d destination/reade.md
```
