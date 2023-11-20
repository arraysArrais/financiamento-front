import { DataTable } from 'mantine-datatable';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Parcela } from './types/ParcelaProps'
import { ActionIcon, Box, Group } from '@mantine/core';
import { IconTrash, IconCheck, IconPencil } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import './style.css'

const PAGE_SIZE = 12;

export default function ParcelaTable({ data }: { data: Parcela[] }) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(data.slice(0, PAGE_SIZE));

  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(data.slice(from, to));
  }, [page]);

  const handleBaixaAction = (id: number) => {

    console.log('parcela id!!!', id)

    //chamar serviço para dar baixa na fatura...
    notifications.show({
      title: 'Notificação',
      message: 'Dando baixa na fatura...',
      color: 'green',
      //icon:
      loading: true
    })
  }

  const handleEditAction = () => {

    //chamar serviço para editar valor da fatura
    notifications.show({
      title: 'Notificação',
      message: 'Fatura editada!',
      color: 'yellow',
      //icon:
      loading: false
    })
  }


  return (
    <DataTable
      height={300}
      withTableBorder
      records={records}
      columns={[
        {
          accessor: 'data_vencimento',
          textAlign: 'right',
          width: 120,
          render: ({ data_vencimento }) => dayjs(data_vencimento).format('DD/MM/YYYY'),

        },
        { accessor: 'valor', width: 100 },
        { accessor: 'status', width: 100 },
        {
          accessor: 'actions',
          title: <Box mr={6}>Ações</Box>,
          textAlign: 'right',
          render: (element) => (
            <Group gap={4} justify="left" wrap="nowrap">
              <ActionIcon
                size="sm"
                variant="subtle"
                color="green"
                onClick={() => handleBaixaAction(element.id)}
              >
                <IconCheck size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                color="yellow"
                onClick={() => handleEditAction()}
              >
                <IconPencil size={16} />
              </ActionIcon>
              {/*               <ActionIcon
                size="sm"
                variant="subtle"
                color="pink"
                onClick={() => alert('clicou!')}
              >
                <IconTrash size={16} />
              </ActionIcon> */}
            </Group>
          ),
        },
      ]}
      totalRecords={data.length}
      recordsPerPage={PAGE_SIZE}
      page={page}
      onPageChange={(p) => setPage(p)}

      // 👇 uncomment the next line to use a custom pagination size
      //paginationSize="md"
      // 👇 uncomment the next line to use a custom loading text
      // loadingText="Loading..."
      // 👇 uncomment the next line to display a custom text when no records were found
      // noRecordsText="No records found"
      // 👇 uncomment the next line to use a custom pagination text
      // paginationText={({ from, to, totalRecords }) => `Parcelas ${from} - ${to} de ${totalRecords}`}
      // 👇 uncomment the next lines to use custom pagination colors
      // paginationActiveBackgroundColor="green"
      // paginationActiveTextColor="#e6e348"
      //emptyState={<></>}
    />
  );
}