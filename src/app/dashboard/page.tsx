"use client";

import { signOut } from "next-auth/react";
import { useDebtsSummary } from "@/_hooks/useDebtsSummary";
import { SimpleGrid, Card, Text, Title, Badge, Container, Group, Paper, Loader, Blockquote } from '@mantine/core';
import { IconCurrencyDollar, IconInfoCircle } from '@tabler/icons-react';
import { DonutChart } from '@mantine/charts';
import { useEffect } from "react";

const formatToBRL = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const StatisticsBadge = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: number, color: string }) => (
    <Group mt={20}>
        <Paper p="xs" radius="xl" shadow="xs" style={{ backgroundColor: color, width: 50, height: 50 }}>
            {icon}
        </Paper>
        <Group>
            <Text size="xs" style={{ color: '#9E9E9E' }}>{label}</Text>
            <Text>{formatToBRL(value)}</Text>
        </Group>
    </Group>
);

const DashboardHome: React.FC = () => {
    const { data: debtsSummary, isLoading, error }: any = useDebtsSummary();

    useEffect(() => {
        if (!debtsSummary && !isLoading) {
            signOut({
                callbackUrl: '/',
            });
        }
    }, [debtsSummary])
    

    return !isLoading ? (
        <Container size="xl">
            <Title order={2}>Visão Geral das Finanças</Title>
            <Text size="sm" color="dimmed">
                Um resumo completo de todas as suas dívidas, incluindo pendências, pagamentos e atrasos.
            </Text>
            {/* agora deixe as colunas responsivas */}
            <SimpleGrid cols={{ base: 1, sm: 1, md: 2, lg: 3 }} spacing="md" mt={60}>
                {/* Resumo do Valor Total das Dívidas */}
                <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={4}>Resumo do Valor Total das Dívidas</Title>
                    <StatisticsBadge
                        icon={<IconCurrencyDollar size={32} color="#228BE6" />}
                        label="Valor Total"
                        value={Number(debtsSummary?.total_debt_value)}
                        color="#E0F2FE"
                    />
                    <Blockquote mt={20} color="blue" icon={<IconInfoCircle />}>
                        O valor total representa a soma de todas as dívidas registradas até a data de hoje.
                    </Blockquote>
                </Card>

                {/* Detalhe proporcional de dívidas */}
                <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={4}>Proporção das Dívidas</Title>
                    <Group align="center" justify="center" mt={20}>
                        <DonutChart
                            data={[
                                {
                                    name: 'Pendente',
                                    value: Number(debtsSummary?.percentage_pending.toFixed(2)),
                                    color: 'cyan',
                                },
                                {
                                    name: 'Paga',
                                    value: Number(debtsSummary?.percentage_paid.toFixed(2)),
                                    color: 'green',
                                },
                                {
                                    name: 'Atrasado',
                                    value: Number(debtsSummary?.percentage_overdue.toFixed(2)),
                                    color: 'red',
                                },
                            ]}
                            labelsType="percent" withLabels paddingAngle={10} />
                    </Group> 
                </Card>

                {/* Análise detalhada por categoria */}
                <Card shadow="sm" p="lg" radius="md" withBorder>
                    <Title order={4}>Análise Detalhada</Title>
                    <Group align="center" justify="center" mt={20}>
                        <Badge color="cyan" size="lg">Pendentes: {formatToBRL(Number(debtsSummary?.total_pending_value))}</Badge>
                        <Badge color="green" size="lg">Pagas: {formatToBRL(Number(debtsSummary?.total_paid_value))}</Badge>
                        <Badge color="red" size="lg">Em Atraso: {formatToBRL(Number(debtsSummary?.total_overdue_value))}</Badge>
                        <Text mt={60}>Valor médio por dívida: <b>{formatToBRL(Number(debtsSummary?.average_debt_value))}</b></Text>
                    </Group>
                </Card>
            </SimpleGrid>
        </Container>
    ) : isLoading ? (
        <Container size="xl">
                <Loader color="#ba005a" />
        </Container>
    ) : (
        <Container size="xl">
            <Title order={2}>Visão Geral das Finanças</Title>
            <Text size="sm" color="dimmed">
                Um resumo completo de todas as suas dívidas, incluindo pendências, pagamentos e atrasos.
            </Text>

            <Text color="red">{error?.message}</Text>
        </Container>
    );
};

export default DashboardHome;