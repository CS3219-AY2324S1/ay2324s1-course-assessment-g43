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
import { viewHistoryStore } from "../stores/viewHistoryStore";
import { useEffect } from "react";

export const History = observer(() => {
  const store = viewHistoryStore;
  const userData = localStorage.getItem("user");
  const userObject = JSON.parse(userData);
  const uid = userObject.uid;

  const tableHeaders = [
    {
      key: "datetime",
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

  useEffect(() => {
    store.getAttemptsByUserId(uid);
  }, []);

  const attempts = viewHistoryStore.state.attempts;

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
          {attempts.map((attempt, index) => (
            <Tr key={index}>
              {tableHeaders.map((header) => (
                <Td key={header.key}>{attempt[header.key]}</Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  </PageContainer>
);
});