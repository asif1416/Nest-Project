import { Inject, Injectable } from '@nestjs/common';
import * as fetch from 'node-fetch';
import * as FormData from 'form-data';
import { PAYMENT_CONFIG } from './payment.constants';
import { PaymentConfig } from './payment.config';

const paymentInitDataProcess = (data) => {
  const postData = {};

  postData['store_id'] = 'test676803ef858ea';
  postData['store_passwd'] = 'test676803ef858ea@ssl';
  postData['productcategory'] = data.productcategory;
  postData['tran_id'] = data.tran_id;
  postData['total_amount'] = data.total_amount;
  postData['currency'] = data.currency;
  postData['success_url'] = 'http://localhost:3000/payment/success';
  postData['fail_url'] = 'http://localhost:3000/payment/fail';
  postData['cancel_url'] = 'http://localhost:3000/payment/cancel';

  postData['emi_option'] = data.emi_option;
  postData['emi_max_inst_option'] = data.emi_max_inst_option;
  postData['emi_selected_inst'] = data.emi_selected_inst;

  postData['cus_name'] = data.cus_name;
  postData['cus_email'] = data.cus_email;
  postData['cus_add1'] = data.cus_add1;
  postData['cus_add2'] = data.cus_add2;
  postData['cus_city'] = data.cus_city;
  postData['cus_state'] = data.cus_state;
  postData['cus_postcode'] = data.cus_postcode;
  postData['cus_country'] = data.cus_country;
  postData['cus_phone'] = data.cus_phone;

  postData['shipping_method'] = data.shipping_method;
  postData['num_of_item'] = data.num_of_item;

  postData['product_name'] = data.product_name;
  postData['product_category'] = data.product_category;
  postData['product_profile'] = data.product_profile;

  const fdata = new FormData();
  for (const key in postData) {
    fdata.append(key, postData[key] || '');
  }

  return fdata;
};

@Injectable()
export class PaymentService {
  private readonly baseURL: string;
  private readonly initURL: string;
  private readonly validationURL: string;
  private readonly refundURL: string;
  private readonly refundQueryURL: string;
  private readonly transactionQueryBySessionIdURL: string;
  private readonly transactionQueryByTransactionIdURL: string;
  private readonly store_id: string;
  private readonly store_passwd: string;

  constructor(@Inject(PAYMENT_CONFIG) config: PaymentConfig) {
    const live = config.live;
    this.store_id = config.storeId;
    this.store_passwd = config.storePassword;

    this.baseURL = `https://${live ? 'securepay' : 'sandbox'}.sslcommerz.com`;
    this.initURL = `${this.baseURL}/gwprocess/v4/api.php`;
    this.validationURL = `${this.baseURL}/validator/api/validationserverAPI.php?`;
    this.refundURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.refundQueryURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.transactionQueryBySessionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
    this.transactionQueryByTransactionIdURL = `${this.baseURL}/validator/api/merchantTransIDvalidationAPI.php?`;
  }

  async init(data: any, url: string = this.initURL): Promise<any> {
    data.store_id = this.store_id;
    data.store_passwd = this.store_passwd;
    const formData = paymentInitDataProcess(data);

    return fetch(url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .catch((err) => err);
  }

  async validate(data: any, url: string = this.validationURL): Promise<any> {
    const validationURL = `${url}val_id=${data.val_id}&store_id=${this.store_id}&store_passwd=${this.store_passwd}&v=1&format=json`;

    return fetch(validationURL, {
      method: 'GET',
    })
      .then((response) => response.json())
      .catch((err) => err);
  }

  async paymentSuccess(data: any) {
    console.log('Payment Success Data:', data); 

    return {
      message: 'Payment Data Received',
      data: data,
    };
  }
}