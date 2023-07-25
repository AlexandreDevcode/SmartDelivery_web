import React, { useContext, useEffect, useState } from 'react';
import '../style.css';
import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
  Tag,
  Typography,
} from 'antd';
import {
  AsUserPropsTypes,
  DashContext,
} from '../../../../context/dashboard.context';
import { RegisterValues, acceptPayments } from '../../../Register';
import { api } from '../../../../services/api';
import { toast } from 'react-toastify';
import { EncryptString } from '../../../../helpers/ecryptString';

const ContainerEditDataCompany = () => {
  const { dataCompany, corNavPrev, asUser } = useContext(DashContext);
  const [form] = Form.useForm();
  const [load, setLoad] = useState(false);
  const [payment_methods, setPayment_methods] = useState<string[]>([]);

  const encryptPassword = new EncryptString();

  useEffect(() => {
    function loadPaymentsMethods() {
      setPayment_methods(dataCompany.payments_methods as []);
    }
    loadPaymentsMethods();
  }, [dataCompany.payments_methods]);

  const initialValues: RegisterValues = {
    name_company: dataCompany.name_company,
    cnpj: dataCompany.cnpj,
    phone: dataCompany.phone,
    email: dataCompany.email,
    address: dataCompany.address,
  };

  const handleSubmit = async () => {
    setLoad(true);
    const fieldsValues: RegisterValues = form.getFieldsValue();
    if (!fieldsValues.password) {
      toast.info('Digite sua senha');
      setLoad(false);
      return;
    }

    await api
      .put(
        `update/${asUser.companyId}`,
        {
          name_company: fieldsValues.name_company,
          cnpj: fieldsValues.cnpj,
          phone: fieldsValues.phone,
          email: fieldsValues.email,
          address: fieldsValues.address,
          password: fieldsValues.newpassword,
          payments_methods: payment_methods,
        },
        {
          headers: {
            Authorization: encryptPassword.encryptString({
              text: fieldsValues?.password,
            }),
          },
        }
      )
      .then(() => {
        setLoad(false);
        toast.success('Dados atualizados com sucesso!');
        localStorage.setItem(
          '@sessionDelivery',
          JSON.stringify({
            backgroundColor: asUser.backgroundColor,
            companyId: asUser.companyId,
            email: fieldsValues.email ?? asUser.email,
            name_company: fieldsValues.name_company ?? asUser.name_company,
            id: asUser.id,
            imgProfile: asUser.imgProfile,
          } as AsUserPropsTypes)
        );
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(() => {
        setLoad(false);
        toast.error('Senha invalida!');
      });
  };

  function handleRemovePaymentsMethods(item: string, index: number) {
    setPayment_methods(
      payment_methods?.filter(
        (i: any, position: number) => i !== item || position !== index
      )
    );
  }

  //usando initialValues.name_company como parametro para renderização do form para preenchimento do initialvalues.
  return (
    <div className="container-edit-loja">
      {initialValues.name_company && (
        <Card style={{ width: '100%' }}>
          <Form initialValues={initialValues} form={form}>
            <Row style={{ width: '100%', gap: '10px', flexWrap: 'nowrap' }}>
              <Form.Item
                label="Nome do estabelecimento"
                labelAlign="left"
                name="name_company"
                style={{
                  width: '50%',
                }}
              >
                <Input />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                label="Cnpj"
                name="cnpj"
                style={{ width: '50%' }}
              >
                <Input />
              </Form.Item>
            </Row>
            <Row style={{ width: '100%', gap: '10px', flexWrap: 'nowrap' }}>
              <Form.Item
                labelAlign="left"
                label="Telefone"
                name="phone"
                style={{ width: '30%' }}
              >
                <Input id="phone" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                label="email"
                name="email"
                style={{ width: '70%' }}
              >
                <Input />
              </Form.Item>
            </Row>
            <Row style={{ width: '100%', gap: '10px', flexWrap: 'nowrap' }}>
              <Form.Item
                labelAlign="left"
                label="Endereço"
                name="address"
                style={{ width: '100%' }}
              >
                <Input id="address" />
              </Form.Item>
            </Row>

            <Row>
              <Col style={{ gap: '20px' }}>
                <Typography.Title level={4}>
                  Formas de pagamentos aceitas:
                </Typography.Title>

                {
                  <Row style={{ gap: 10 }}>
                    <select
                      onChange={(e) => {
                        payment_methods?.push(e.target.value);
                        setPayment_methods([...payment_methods]);
                      }}
                      style={{
                        width: '200px',
                        outline: 'none',
                        border: '1px solid silver',
                        padding: '10px',
                      }}
                      placeholder="Selecione"
                    >
                      <option>selecione</option>
                      {acceptPayments.map(
                        (payment: { paymentmode: string }) => {
                          return (
                            <option value={payment.paymentmode}>
                              {payment.paymentmode}
                            </option>
                          );
                        }
                      )}
                    </select>
                    {payment_methods?.map((item: string, index: number) => {
                      return (
                        <div key={index}>
                          <Tag
                            style={{ cursor: 'pointer' }}
                            color="gold"
                            onClick={() =>
                              handleRemovePaymentsMethods(item, index)
                            }
                          >
                            {item} X
                          </Tag>
                        </div>
                      );
                    })}
                  </Row>
                }
              </Col>
            </Row>

            <Row style={{ width: '100%', gap: '10px', flexWrap: 'nowrap' }}>
              <Form.Item
                required
                labelAlign="left"
                label="Senha"
                name="password"
                style={{ width: '100%' }}
              >
                <Input id="password" />
              </Form.Item>
              <Form.Item
                labelAlign="left"
                label="Nova senha"
                name="newpassword"
                style={{ width: '100%' }}
              >
                <Input id="newpassword" />
              </Form.Item>
            </Row>
            <button
              style={{
                width: '200px',
                height: '40px',
                background: !corNavPrev ? '#5b72f2' : corNavPrev,
                color: '#fff',
                borderRadius: '10px',
              }}
              type="submit"
              onClick={handleSubmit}
            >
              {load ? <Spin></Spin> : 'Salvar'}
            </button>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ContainerEditDataCompany;
