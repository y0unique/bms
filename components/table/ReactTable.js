import { Table, Pagination, Checkbox, ScrollArea} from "@mantine/core";
import { useMemo, forwardRef, useRef, useEffect} from "react";
import { useTable, useSortBy, useGlobalFilter, usePagination, useRowSelect  } from "react-table";
import moment from "moment";
import Edit from "./buttons/Edit";
import EditForm from "./buttons/Edit";
import GlobalFilter from "./filter/GlobalFilter";


const IndeterminateCheckbox = forwardRef(
   ({ indeterminate, ...rest }, ref) => {
     const defaultRef = useRef()
     const resolvedRef = ref || defaultRef

     useEffect(() => {
       resolvedRef.current.indeterminate = indeterminate
     }, [resolvedRef, indeterminate])

     return (
       <>
         <Checkbox ref={resolvedRef} {...rest} />
       </>
     )
   }
 )

const ReactTable = ({ data, setSelectedID, selectedID, cols,  title, endpoint, addButton, deleteButton }) => {


  const pageCount = useMemo(() => Math.ceil(data.length / 10), [data]);
  const columns = useMemo(
    () => cols,
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    state,
    setGlobalFilter,
    selectedFlatRows,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      pageCount,
      autoResetHiddenColumns: false
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
           hooks.visibleColumns.push(columns => [
             {
               id: 'selection',
               Header: ({ getToggleAllPageRowsSelectedProps }) => (
                 <div>
                  <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} />
                </div>
               ),
               Cell: ({ row }) => (
                <div>
                 <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
                </div>
              ),
            },
            ...columns,
          ])
        }
  );
  const handlePageChange = (pageNum) => gotoPage(pageNum - 1);
  
 


  useMemo(() => {
    const ids = selectedFlatRows.map(d => d.original._id);
    setSelectedID(ids);
  }, [selectedFlatRows]);
  
 const { globalFilter } = state;

  return (
    <>
     <ScrollArea>
    <GlobalFilter setGlobalFilter={setGlobalFilter}  filter={globalFilter} addButton={addButton} deleteButton={deleteButton}/>
      <Table {...getTableProps()}  highlightOnHover sx={{ minWidth: 800 }} >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps({style: {height: "100%"}})}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
      </ScrollArea>
      <Pagination
        page={pageIndex + 1}
        total={pageCount}
        onChange={handlePageChange}
        m={20}
      />
     
    </>
  );
};

export default ReactTable;
