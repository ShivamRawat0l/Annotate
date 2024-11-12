export type Style = { [key: string]: React.CSSProperties };

export const globalStyles: Style = {
  flexRow: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  flexColumn: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
};
