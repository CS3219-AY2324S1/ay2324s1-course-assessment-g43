import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";

export const History = observer(() => {
  const tableHeaders = [
    {
      key: "attemptedDate",
      label: "Date Attempted",
    },
    {
      key: "title",
      label: "Question Title",
    },
    {
      key: "complexity",
      label: "Complexity",
    },
  ];

  return (
    <PageContainer w={"100%"}>
      <TableContainer w={"100%"}>
        <Table variant="simple">
          <TableCaption>-End of attempted questions-</TableCaption>
          <Thead>
            <Tr>
              {tableHeaders.map((header) => (
                <Th key={header.key}>{header.label}</Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td isNumeric>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td isNumeric>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td isNumeric>0.91444</Td>
            </Tr>
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
              <Th isNumeric>multiply by</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </PageContainer>
  );
});
