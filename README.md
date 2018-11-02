# lerna-atlas

Small tool for generating a list of packages in Lerna monorepo readme file.

## Installation

```
npm install -g lerna-atlas
```

## Usage

Add the following lines to your `README.md` file:

```markdown
<!--- LERNA_PACKAGES --->
<!--- /LERNA_PACKAGES --->
```

In terminal, run the following command:

```
lerna-atlas
```

You can optionally specify other readme file:

```
lerna-atlas -s source/readme.md -d destination/readme.md
```
