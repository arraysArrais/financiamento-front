import { DataTable } from 'mantine-datatable';
import dayjs from 'dayjs';
import { FormEvent, useEffect, useState } from 'react';
import { Parcela } from './types/ParcelaProps'
import { ActionIcon, Box, Button, FileInput, Group, Loader, Modal, Stack, rem, Image, Card, Progress, Text, TextInput } from '@mantine/core';
import { IconCheck, IconPencil, IconPhoto, IconBarcode, IconCopy } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import './style.css'
import { useDisclosure } from '@mantine/hooks';
import useApi from '../../services/financiamentoService';
import { Barcode } from '../../pages/Financiamentos/types/Barcode.type';

const PAGE_SIZE = 6;

interface ParcelaTableProps {
  data: Parcela[];
  closeParcelaModal: () => void; // This function is not related to Parcela properties
}

const ParcelaTable: React.FC<ParcelaTableProps> = ({ data, closeParcelaModal }) => {
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

  const [barCodeModal, { open: openBarCodeModal, close: closeBarCodeModal }] = useDisclosure(false); //modal do código de barras
  const [barCodeData, setBarCodeData] = useState<Barcode | any>()

  const [barCodeInputDisabled, setBarCodeInputDisabled] = useState(true)
  const [barCodeActionBtnDisabled, setBarCodeActionBtnDisabled] = useState(true)

  let valorPago = data.reduce((totalizador, prox) => {
    if (prox.status == 'Paga') {
      totalizador += +prox.valor;
    }
    return totalizador;
  }, 0);

  let valorTotal = data.reduce((totalizador, prox) => {
    totalizador += +prox.valor

    return totalizador
  }, 0);


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
    closeParcelaModal()
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

  const handleCodeBarAction = async (parcela_id: number) => {
    openBarCodeModal() // abre o modal pra exibir o código de barras
    setBarCodeData([]); //esvazia o state do codigo de barras para não exibir o mesmo para todos


    try {
      const result = await apiServices.getCodBarra(parcela_id);
      setBarCodeData(result)
    } catch (error) {
      console.log('Erro ao buscar código de barra da parcela ' + parcela_id)
    }
  }

  const handleEditBarCodeBtn = async (parcela_id: number) => {
    //chamar serviço da api para alterar o código de barras
    let result = await apiServices.updateFatura(parcela_id, { codigo_barras: barCodeData.code })

    //exibir notificação do processo no final
    if (JSON.stringify(result).includes('atualizada')) {
      notifications.show({
        title: 'Notificação',
        message: 'Código de barras atualizado com sucesso',
        color: 'yellow',
        //icon:
        loading: false
      })
    }
    else {
      notifications.show({
        title: 'Notificação',
        message: 'Erro ao atualizar código de barras: ' + result.error,
        color: 'red',
        //icon:
        loading: false
      })
    }

    //desativa o input
    setBarCodeInputDisabled(true)

    //desativa o botão de alterar
    setBarCodeActionBtnDisabled(true)
  }

  const handleCopyButton = () => {
    navigator.clipboard.writeText(barCodeData.code)
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
        <Image
          src={`data:${tipoComprovante};base64,${comprovateImgString}`}
          //height={720}
          fit='cover'
        />
      </Modal>

      <Modal opened={barCodeModal} onClose={closeBarCodeModal} title="Codigo de barras" size={'md'} centered>
        <TextInput
          value={barCodeData?.code}
          disabled={barCodeInputDisabled}
          onChange={(e) => {
            let barCode = { ...barCodeData };
            barCode.code = e.currentTarget.value

            setBarCodeData(barCode)
            //permite o clique no botão p/ enviar a alteração
            setBarCodeActionBtnDisabled(false)
            console.log(barCodeData)
          }}

        />
        <br />
        {/* <Button variant="filled" size='compact-sm' onClick={(e) => {
          setBarCodeInputDisabled(false)
        }}>Alterar</Button> */}
        <Group justify='end'>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="yellow"
            onClick={() => {
              setBarCodeInputDisabled(false)
            }}
          >
            <IconPencil size={20} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            color="yellow"
            onClick={() => {handleEditBarCodeBtn(barCodeData.id)}}
            disabled={barCodeActionBtnDisabled}
            bg={'transparent'}
          >
            <IconCheck size={20} color='green' />
          </ActionIcon>
          <ActionIcon
            size="sm"
            onClick={handleCopyButton}
            bg={'transparent'}
          >
            <IconCopy size={20} color='gray' />
          </ActionIcon>
        </Group>

     
      </Modal>
      <DataTable
        height={320}
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
                {element.status == 'Pendente' ? <ActionIcon
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
                  : <></>}
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
                <ActionIcon
                  size="sm"
                  variant="subtle"
                  color="blue"
                  onClick={() => handleCodeBarAction(element.id)}
                >

                  <IconBarcode size={16} />
                </ActionIcon>
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

      <div className='progress'>
        <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)">
          <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
            Progresso
          </Text>
          <Text fz="lg" fw={500}>
            R$ {valorPago.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false })} / R$ {valorTotal.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2, useGrouping: false })}
          </Text>
          <Progress value={(valorPago / valorTotal) * 100} mt="md" size="md" radius="md" />
        </Card>
      </div>
    </div>
  );
}

export default ParcelaTable;