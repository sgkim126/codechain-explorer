import * as React from "react";
import { Dispatch, connect } from "react-redux";

import { apiRequest, ApiError } from "./ApiRequest";
import { TransactionDoc } from "../../db/DocType";

interface OwnProps {
    itemsPerPage: number;
    page: number;
    address: string;
    onTransactions: (transactions: TransactionDoc[], address: string) => void;
    onError: (e: ApiError) => void;
    progressBarTarget?: string;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransferAddressTransactionsInternal extends React.Component<Props> {
    public componentWillMount() {
        const { address, onTransactions, onError, dispatch, progressBarTarget, page, itemsPerPage } = this.props;
        apiRequest({ path: `addr-asset-txs/${address}?page=${page}&itemsPerPage=${itemsPerPage}`, dispatch, showProgressBar: true, progressBarTarget }).then((response: TransactionDoc[]) => {
            onTransactions(response, address);
        }).catch(onError);
    }
    public render() {
        return (null);
    }
}

const RequestAssetTransferAddressTransactions = connect(null, ((dispatch: Dispatch) => {
    return { dispatch }
}))(RequestAssetTransferAddressTransactionsInternal);

export default RequestAssetTransferAddressTransactions;
