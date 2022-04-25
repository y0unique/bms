import React, { useState, useMemo } from "react";
import {
  TextInput,
  
  Text,
  Button,
  useMantineColorScheme,
  Group,
  Modal,
  ActionIcon,
  Notification
} from "@mantine/core";
import { Search, RotateClockwise, Check  } from "tabler-icons-react";
import DataTable, { createTheme } from "react-data-table-component";
import differenceBy from 'lodash/differenceBy';
import { showNotification } from '@mantine/notifications';

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
  const [opened, setOpened] = useState(false);
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

  const handleDelete = () => {
    showNotification({
      title: 'Delete Resident',
      message: 'Data Deleted Successfully ',
      icon: <Check />,
      color: "teal",
    })
     setToggleCleared(!toggleCleared);
     setData(differenceBy(data, selectedRows, 'name'));
  };
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
        <Modal
          opened={opened}
          onClose={() => setOpened(false)}
          title="Add Resident Records"
          centered
        >
          {/* Modal content */}
        </Modal>

        <Button onClick={() => setOpened(true)} variant="light">
          Add Records
        </Button>
        <Button onClick={() => handleDelete()} variant="light" color="red">
          Delete
        </Button>
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
