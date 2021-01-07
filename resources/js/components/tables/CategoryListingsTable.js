import React from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableFooter,
  TableSortLabel,
  Paper
} from "@material-ui/core";

export default props => {
  return (
    <React.Fragment>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={props.sortBy === "category"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("category")}
                >
                  Category
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={props.sortBy === "account_type"}
                  direction={props.sortOrder}
                  onClick={props.requestSort("account_type")}
                >
                  Account Type
                </TableSortLabel>
              </TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((item, indx) => {
              return (
                <TableRow key={indx}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.account_type}</TableCell>
                  <TableCell>edit delete here</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter />
        </Table>
      </Paper>
    </React.Fragment>
  );
};
