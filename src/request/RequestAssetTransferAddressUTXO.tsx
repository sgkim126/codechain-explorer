import * as React from "react";
import { connect, Dispatch } from "react-redux";

import { AggsUTXODoc } from "codechain-indexer-types";
import { ApiError, apiRequest } from "./ApiRequest";
import { AggsUTXOResponse } from "./RequestAssetTypeUTXO";

// FIXME: Support pagination
interface OwnProps {
    address: string;
    onAggsUTXO: (aggsUTXO: AggsUTXODoc[]) => void;
    onError: (e: ApiError) => void;
}

interface DispatchProps {
    dispatch: Dispatch;
}

type Props = OwnProps & DispatchProps;

class RequestAssetTransferAddressUTXO extends React.Component<Props> {
    public componentWillMount() {
        const { address, onAggsUTXO, onError, dispatch } = this.props;
        const path = `aggs-utxo?address=${address}`;
        apiRequest({ path, dispatch, showProgressBar: true })
            .then((response: AggsUTXOResponse) => {
                onAggsUTXO(response.data);
            })
            .catch(onError);
    }

    public render() {
        return null;
    }
}

export default connect()(RequestAssetTransferAddressUTXO);
