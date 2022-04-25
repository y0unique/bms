import React, { useState, useMemo } from "react";
import {
  TextInput,
  Text,
  Button,
  useMantineColorScheme,
  Group,
  Modal,
  ActionIcon,
} from "@mantine/core";
import { Search, RotateClockwise, Check } from "tabler-icons-react";
import DataTable, { createTheme } from "react-data-table-component";
import AddRecordButton from "./addRecordButton";
import DeleteRecordButton from "./deleteRecordButton";

const FilterComponent = ({ filterText, onFilter, onClear }) => (
  <>
    <TextInput
      placeholder="Search by any field"
      icon={<Search size={14} />}
      value={filterText}
      onChange={onFilter}
      rightSection={<ActionIcon onClick={onClear}> <RotateClockwise size={14} /> </ActionIcon>}
    />
  </>
);

export function TableResident({ data, setData, columns }) {
  const { colorScheme } = useMantineColorScheme();
  const [selectedRows, setSelectedRows] = React.useState([]);
  const [filterText, setFilterText] = React.useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [toggleCleared, setToggleCleared] = useState(false);


  const filteredItems = data.filter(
    item => item.firstname && item.firstname.toLowerCase().includes(filterText.toLowerCase()),
  );
  const handleRowSelected = React.useCallback(state => {
    setSelectedRows(state.selectedRows);

  }, []);

  
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
    };
    return (
      <FilterComponent onFilter={e => setFilterText(e.target.value)} onClear={handleClear} filterText={filterText} />
    );
  }, [filterText, resetPaginationToggle]);


  createTheme("theme", {
    text: {
      primary: colorScheme,
      secondary: colorScheme,
    },
    background: {
      default: colorScheme,
    },
    sortFocus: {
      default: colorScheme === "light" ? "#00000" : "#ffffff",
    },
    divider: {
      default: colorScheme === "light" ? "#e9ecef" : "#dee2e6",
    },
  });


  return (
    <>
      <Group position="right" mb={10}>

        <AddRecordButton />
        <DeleteRecordButton selectedRows={selectedRows} data={data} setData={setData} toggleCleared={toggleCleared} setToggleCleared={setToggleCleared}/>
      

       
      </Group>

      <DataTable
        columns={columns}
        data={filteredItems}
        theme="theme"
        pagination
        selectableRows
        subHeader
        subHeaderComponent={subHeaderComponentMemo}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
      />
    </>
  );
}
