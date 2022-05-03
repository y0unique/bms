import { TextInput, Group, ActionIcon } from "@mantine/core";
import { Search, RotateClockwise, Check } from "tabler-icons-react";
const GlobalFilter = ({ filter, setGlobalFilter }) => {
  // Create a handle for clearing the filter
  const handleClear = () => {
    setGlobalFilter("");
  };
  return (
    // Create a search input
    <Group position="right" mb={20}>
      <TextInput
        icon={<Search size={14} />}
        placeholder="Search"
        onChange={(e) => {
          // Set the global filter to the value of the input
          setGlobalFilter(e.target.value || undefined);
        }}
        value={filter ? filter.value : ""}
        rightSection={
          <ActionIcon onClick={handleClear}>
            {" "}
            <RotateClockwise size={14} />{" "}
          </ActionIcon>
        }
      />
    </Group>
  );
};

export default GlobalFilter;
