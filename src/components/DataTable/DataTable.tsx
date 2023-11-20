import { DataTable } from 'mantine-datatable';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { Parcela } from './types/ParcelaProps'
import { ActionIcon, Box, Button, FileInput, Group, Loader, Modal, Stack, rem, Image } from '@mantine/core';
import { IconTrash, IconCheck, IconPencil, IconPhoto, IconEye } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import './style.css'
import { useDisclosure } from '@mantine/hooks';
import useApi from '../../services/financiamentoService';

const PAGE_SIZE = 12;

export default function ParcelaTable({ data }: { data: Parcela[] }) {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState(data.slice(0, PAGE_SIZE));

  const icon = <IconPhoto style={{ width: rem(18), height: rem(18) }} stroke={1.5} />;
  const [file, setFile] = useState<File | null>(null);

  const [baixaFaturaModal, { open: openBaixaFaturaModal, close: closeBaixaFaturaModal }] = useDisclosure(false); //modal baixa de parcela
  const [viewComprovanteModal, { open: openComprovanteModal, close: closeComprovanteModal }] = useDisclosure(false); //modal comprovante

  const [baixaParcelaId, setBaixaParcelaId] = useState<number | null>(null);

  const [baixaParcelaModalLoading, setBaixaParcelaModalLoading] = useState(false);

  const apiServices = useApi();

  const [comprovateImgString, setComprovateImgString] = useState('');
  const [tipoComprovante, setTipoComprovante] = useState('');


  useEffect(() => {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE;
    setRecords(data.slice(from, to));
  }, [page]);

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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    setBaixaParcelaModalLoading(true)
    event.preventDefault();
    uploadFile(file)
  }

  const uploadFile = async (file: any) => {
    var result = await apiServices.baixaFatura(baixaParcelaId, file); // TODO: jogar para fila
    setBaixaParcelaModalLoading(false)
    closeBaixaFaturaModal()

    notifications.show({
      title: 'Notificação',
      message: (result.message) ? result.message : 'Erro. Contate o administrador',
      color: (result.message) ? 'green' : 'red',
      //icon:
      loading: false
    });
  };

  const handleViewComprovanteAction = async (parcela_id: number) => {
    let result = await apiServices.getComprovante(parcela_id);

    openComprovanteModal()
    setComprovateImgString(result.comprovante_string)
    setTipoComprovante(result.comprovante_tipo)
  }

  return (
    <div>
      <Modal opened={baixaFaturaModal} onClose={closeBaixaFaturaModal} title="Anexar comprovante" size={'md'} centered>
        <div className='fileInput'>
          <form onSubmit={handleSubmit}>
            <Stack justify='center'>
              <FileInput
                size="xs"
                label="Comprovante"
                withAsterisk
                //error="É preciso inserir um comprovante de pagamento do boleto"
                placeholder="Selecione o comprovante"
                accept='image/png,image/jpeg'
                rightSection={icon}
                onChange={setFile}
                value={file}
              />
              {/* <input type='file' ref={fileInputRef}/> */}
              <Group justify='center'>
                {baixaParcelaModalLoading ? <Loader /> : <Button type='submit'>Enviar</Button>}
              </Group>
            </Stack >
          </form>
        </div>
      </Modal>

      <Modal opened={viewComprovanteModal} onClose={closeComprovanteModal} title="Comprovante" size={'md'} centered>
        {/* src={`data:${comprovateImgString};base64,${tipoComprovante}`}
          height={160} */}

        <Image
          src={`data:${tipoComprovante};base64,${comprovateImgString}`}
          height={720}
          fit='cover'
        />
      </Modal>
      <DataTable
        height={300}
        striped={true}
        withTableBorder={true}
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
                  onClick={() => {
                    setBaixaParcelaId(element.id)
                    openBaixaFaturaModal()
                  }}
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
                {element.status == 'Paga' ?
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="indigo"
                    onClick={() => handleViewComprovanteAction(element.id)}
                  >
                    <IconPhoto size={16} />
                  </ActionIcon> : <></>}
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
    </div>
  );
}