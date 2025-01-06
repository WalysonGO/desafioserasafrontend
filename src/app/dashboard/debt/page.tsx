"use client";

import React, { useEffect, useState } from 'react'
import { Title, Text, Flex, Button, Select, Group, Paper, Pagination, Tooltip, Badge, Modal, TextInput, Loader, Menu, InputBase } from '@mantine/core'
import { useDebtsList } from '../../../_hooks/useDebtsList'
import styles from './debt.module.css'
import { IconDotsVertical, IconFileDiff, IconRefresh } from '@tabler/icons-react'
import { DateInput, DatePickerInput, DatesProvider } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDebtsCreate } from '../../../_hooks/useDebtsCreate'
import { notifications } from '@mantine/notifications'
import { useDebtUpdate } from '../../../_hooks/useDebtsUpdate'
import moment from 'moment-timezone'
import { useDebtDelete } from '@/_hooks/useDebtsDelete';

const DashboardDebtsPage: React.FC = () => {
    const [initialDate] = useState(new Date());
    const [perPage, setPerPage] = React.useState<string>("5");
    const [filterStatus, setFilterStatus] = React.useState<string>("all");
    const [page, setPage] = React.useState<string>("1");

    const { data: responseData, isLoading, error, refetch } = useDebtsList(page, perPage, filterStatus);
    const { data: debtsData, total, next } = responseData || { data: [], total: 0, current: 1, next: null, prev: null };

    const [currentDebt, setCurrentDebt] = useState<any>(null);
    const [createModalOpened, setCreateModalOpened] = useState(false);
    const [updateModalOpened, setUpdateModalOpened] = useState(false);

    const { mutate: createDebt } = useDebtsCreate();
    const { mutate: updateDebt, isLoading: isUpdating } = useDebtUpdate();
    const { mutate: deleteDebt } = useDebtDelete();

    const totalDePaginas = Math.ceil(total / Number(perPage));

    useEffect(() => {
        if (page && perPage && filterStatus) {
            refetch();
        }
    }, [page, perPage, filterStatus, refetch]);

    const handlePageChange = (page: number) => {
        setPage(String(page));
    };

    // Formulário para criação  
    const formCreate = useForm({
        initialValues: {
            title: '',
            due_date: initialDate,
            status: '',
            amount: 0.0,
            observations: '',
        },
    });

    // Formulário para atualização  
    const formUpdate = useForm({
        initialValues: {
            id: '',
            title: '',
            due_date: '',
            status: '',
            amount: 0.0,
            observations: '',
        },
    });

    useEffect(() => {
        if (currentDebt) {
            formUpdate.setValues({
                id: String(currentDebt.id),
                title: currentDebt.title,
                due_date: currentDebt.due_date,
                status: currentDebt.status,
                amount: currentDebt.amount,
                observations: currentDebt.observations,
            });
        }
    }, [currentDebt]);

    const openUpdateModal = (debt: any) => {
        setCurrentDebt(debt);
        setUpdateModalOpened(true);
        formUpdate.setValues({
            id: String(debt.id),
            title: debt.title,
            due_date: debt.due_date,
            status: debt.status,
            amount: parseFloat(debt.amount),
            observations: debt.observations
        })
    };

    useEffect(() => {
        console.log(formUpdate.values);
        
    }, [formUpdate.values]);

    const handleCreateDebt = async () => {
        try {
            createDebt({
                title: formCreate.values.title,
                due_date: String(formCreate.values.due_date),
                status: formCreate.values.status,
                amount: parseFloat(String(formCreate.values.amount)),
                observations: formCreate.values.observations
            });
            console.log("Passou aqui");
            
            setTimeout(() => {
                refetch();
            }, 1000);

            setCreateModalOpened(false);
            formCreate.reset();
        } catch (error) {
            console.error('Erro ao criar dívida:', error);
        }
    };

    const handleUpdateDebt = async () => {
        try {
            updateDebt({
                id: currentDebt.id,
                title: formUpdate.values.title,
                due_date: String(formUpdate.values.due_date),
                status: formUpdate.values.status,
                amount: parseFloat(String(formUpdate.values.amount)),
                observations: formUpdate.values.observations
            })
            setTimeout(() => {
                refetch();
            }, 1000);

            setUpdateModalOpened(false);
            formUpdate.reset();
        } catch (error) {
            console.error('Erro ao atualizar dívida:', error);
        }
    };

    const handleDeleteDebt = async (debtId: string) => {
        if (window.confirm('Tem certeza que deseja deletar esta dívida?')) {
            try {
                deleteDebt(String(debtId));
                setTimeout(() => {
                    refetch();
                }, 1000);
            } catch (error) {
                console.error('Erro ao deletar dívida:', error);
                notifications.show({
                    title: 'Erro',
                    message: 'Não foi possível deletar a dívida.',
                    color: 'red',
                });
            }
        }
    };

    if (error) return <Text>Error: {error.message}</Text>;


    return (
        <Flex direction="column" gap="md" align="center" w={"100%"}>
            <Group className={styles.header}>
                <Group align="center" gap={10}>
                    <Title order={1}>Dívidas Cadastradas</Title>
                    <Tooltip label="Atualizar dívidas">
                        <IconRefresh onClick={() => refetch()} size={26} color='#ba005a' />
                    </Tooltip>
                </Group>

                <Tooltip label="Cadastrar nova dívida">
                    <Button
                        leftSection={<IconFileDiff size={22} color='white' />}
                        variant='filled'
                        color='#ba005a'
                        onClick={() => setCreateModalOpened(true)}
                    >
                        <Text>Adicionar dívida</Text>
                    </Button>
                </Tooltip>
            </Group>

            <Paper withBorder shadow="sm" p="md" radius="md" mb="md" className={styles.control}>
                <Group>
                    <Select
                        label="Itens por página"
                        value={perPage.toString()}
                        onChange={(value) => setPerPage(String(value))}
                        data={[
                            { value: '2', label: '2' },
                            { value: '5', label: '5' },
                            { value: '10', label: '10' },
                            { value: '20', label: '20' },
                            { value: '50', label: '50' }
                        ]}
                        clearable
                    />
                    <Select
                        label="Filtro por status"
                        value={filterStatus.toString()}
                        onChange={(value) => setFilterStatus(String(value))}
                        data={[
                            { value: 'all', label: 'Todos' },
                            { value: 'pendente', label: 'Pendente' },
                            { value: 'pago', label: 'Pago' },
                            { value: 'atrasado', label: 'Atrasado' }
                        ]}
                        clearable
                    />
                </Group>
            </Paper>
            {
                !isLoading ? (
                    <>
                        <Flex direction="column" w={"100%"} gap="md" justify="center">
                            {debtsData.map(debt => (
                                <Flex key={debt.id} align="center" className={styles.debtRow} justify="space-between">
                                    <Flex direction="column" className={styles.column}>
                                        <Title order={5}>Título</Title>
                                        <Text mt="xs">{debt.title}</Text>
                                    </Flex>

                                    <Flex direction="column" className={styles.column}>
                                        <Title order={5}>Vencimento</Title>
                                        <Text mt="xs">{moment(debt.due_date).tz('America/Recife').format('DD/MM/YYYY')}</Text>
                                    </Flex>

                                    <Flex direction="column" className={styles.column}>
                                        <Title order={5}>Status</Title>
                                        <Text mt="xs">
                                            {
                                                debt.status === "pendente" ? (
                                                    <Badge color="yellow">Pendente</Badge>
                                                ) : debt.status === "pago" ? (
                                                    <Badge color="green">Pago</Badge>
                                                ) : (
                                                    <Badge color="red">Atrasado</Badge>
                                                )
                                            }</Text>
                                    </Flex>

                                    <Flex direction="column" className={styles.column}>
                                        <Title order={5}>A Pagar</Title>
                                        <Text mt="xs">R$ {debt.amount.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}</Text>
                                    </Flex>

                                    <Flex direction="column" className={styles.column}>
                                        <Title order={5}>Observações</Title>
                                        <Text mt="xs">{debt.observations}</Text>
                                    </Flex>

                                    <Menu>
                                        <Menu.Target>
                                            <Button variant="transparent" style={{ marginTop: '10px' }}>
                                                <IconDotsVertical size={28} color='#ba005a' />
                                            </Button>
                                        </Menu.Target>

                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={() => openUpdateModal(debt)}
                                            >
                                                Editar
                                            </Menu.Item>
                                            <Menu.Item
                                                onClick={() => handleDeleteDebt(String(debt.id))}
                                            >
                                                Deletar
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Flex>
                            ))}
                        </Flex>
                        <Pagination.Root
                            total={totalDePaginas}
                            siblings={1}
                            boundaries={2}
                            value={Number(page)}
                            onChange={handlePageChange}
                            mt={20}
                            color="#ba005a"
                        >
                            <Group gap={5} justify="center">
                                <Pagination.Previous />
                                <Pagination.Items />
                                <Pagination.Next disabled={next === null} />
                            </Group>
                        </Pagination.Root>
                    </>
                ) : (
                    <>
                        <Loader color='#ba005a' />
                    </>
                )
            }

            {/* Modal para Criar Dívida */}
            <Modal
                opened={createModalOpened}
                onClose={() => setCreateModalOpened(false)}
                title="Criar Nova Dívida"
            >
                <TextInput label="Título" placeholder="Título da dívida" {...formCreate.getInputProps('title')} />
                <DatesProvider settings={{ locale: 'br', firstDayOfWeek: 0, weekendDays: [0] }}>
                    <DateInput
                        label="Vencimento"
                        placeholder="Data de vencimento"
                        valueFormat="DD/MM/YYYY"
                        value={moment(initialDate).tz('America/Recife')}
                        clearable
                        {...formCreate.getInputProps('due_date')}
                    />
                </DatesProvider>
                <Select
                    label="Status"
                    placeholder="Status da dívida"
                    data={[
                        { value: 'pendente', label: 'Pendente' },
                        { value: 'pago', label: 'Pago' },
                        { value: 'atrasado', label: 'Atrasado' },
                    ]}
                    {...formCreate.getInputProps('status')}
                />
                <TextInput label="Valor" placeholder="Valor a pagar" {...formCreate.getInputProps('amount')} />
                <TextInput label="Observações" maxLength={45} placeholder="Observações" {...formCreate.getInputProps('observations')} />
                <Group mt="md">
                    <Button
                        variant='filled'
                        color='#ba005a'
                        onClick={handleCreateDebt}>Adicionar</Button>
                </Group>
            </Modal>

            {/* Modal para Atualizar Dívida */}
            <Modal
                opened={updateModalOpened}
                onClose={() => setUpdateModalOpened(false)}
                title="Atualizar Dívida"
            >

                <TextInput label="Título" placeholder="Título da dívida" {...formUpdate.getInputProps('title')} />
                <DatePickerInput
                    label="Vencimento"
                    placeholder="Data de vencimento"
                    valueFormat="DD/MM/YYYY"
                    value={formUpdate.values.due_date ? moment(formUpdate.values.due_date).tz('America/Recife') : null}
                    onChange={date => formUpdate.setFieldValue('due_date', String(date))}
                    locale="pt-br"
                    clearable
                />
                <Select label="Status" placeholder="Status da dívida" data={[{ value: 'pendente', label: 'Pendente' }, { value: 'pago', label: 'Pago' }, { value: 'atrasado', label: 'Atrasado' }]} {...formUpdate.getInputProps('status')} />
                <TextInput label="Valor" placeholder="Valor a pagar" {...formUpdate.getInputProps('amount')} />
                <TextInput label="Observações" maxLength={45} placeholder="Observações" {...formUpdate.getInputProps('observations')} />
                <Group mt="md">
                    <Button
                        leftSection={<IconFileDiff size={22} color='white' />}
                        variant='filled'
                        color='#ba005a'
                        loading={isUpdating}
                        onClick={() => { handleUpdateDebt(); formUpdate.setValues({ id: String(currentDebt.id), title: currentDebt.title, due_date: currentDebt.due_date, status: currentDebt.status, amount: currentDebt.amount, observations: currentDebt.observations }) }}>Atualizar</Button>
                </Group>
            </Modal>
        </Flex>
    );
};

export default DashboardDebtsPage;