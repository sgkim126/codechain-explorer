import * as React from "react";
import * as FontAwesome from "react-fontawesome";
import * as moment from "moment";
import { match } from "react-router";
import { Container, Row, Col } from "reactstrap";

import { RequestParcel, RequestPendingParcel } from "../../request";
import ParcelDetails from "../../components/parcel/ParcelDetails/ParcelDetails";

import "./Parcel.scss";
import ParcelTransactionList from "../../components/parcel/ParcelTransactionList/ParcelTransactionList";
import { ParcelDoc, Type, ChangeShardStateDoc, PendingParcelDoc } from "../../../db/DocType";
import HexString from "../../components/util/HexString/HexString";

interface Props {
    match: match<{ hash: string }>;
}

interface ParcelResult {
    parcel: ParcelDoc;
    status: string;
}

interface State {
    parcelResult?: ParcelResult;
    notExistedInBlock: boolean;
    notExistedInPendingParcel: boolean;
    page: number;
}

class Parcel extends React.Component<Props, State> {
    private itemPerPage = 3;
    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
            notExistedInBlock: false,
            notExistedInPendingParcel: false
        };
    }

    public componentWillReceiveProps(props: Props) {
        const { match: { params: { hash } } } = this.props;
        const { match: { params: { hash: nextHash } } } = props;
        if (nextHash !== hash) {
            this.setState({ parcelResult: undefined, page: 1, notExistedInBlock: false, notExistedInPendingParcel: false });
        }
    }

    public render() {
        const { match: { params: { hash } } } = this.props;
        const { parcelResult, page, notExistedInBlock, notExistedInPendingParcel } = this.state;
        if (!parcelResult) {
            if (!notExistedInBlock) {
                return <RequestParcel hash={hash}
                    onParcel={this.onParcel}
                    onParcelNotExist={this.onParcelNotExist}
                    onError={this.onError} />;
            } else if (!notExistedInPendingParcel) {
                return <RequestPendingParcel hash={hash} onError={this.onError} onPendingParcel={this.onPendingParcel} onPendingParcelNotExist={this.onPendingParcelNotExist} />
            } else {
                return <div>{hash} not found.</div>
            }
        }
        return (<Container className="parcel">
            <Row className="mb-2">
                <Col md="8" xl="7">
                    <div className="d-flex title-container">
                        <h1 className="d-inline-block align-self-center">Parcel</h1>
                        <div className={`type-badge align-self-center ml-3 mr-auto ${this.getBadgeClassNameByAction(parcelResult.parcel.action.action)}`}>{this.getActionString(parcelResult.parcel.action.action)}</div>
                        <span className="timestamp align-self-end">{moment.unix(parcelResult.parcel.timestamp).format("YYYY-MM-DD HH:mm:ssZ")}</span>
                    </div>
                </Col>
            </Row>
            <Row className="mb-4">
                <Col md="8" xl="7" className="hash-container d-flex mb-3 mb-md-0">
                    <div className="d-inline-block hash">
                        <HexString text={parcelResult.parcel.hash} />
                    </div>
                    <div className="d-inline-block copy text-center">
                        <FontAwesome name="copy" />
                    </div>
                </Col>
            </Row>
            <ParcelDetails parcel={parcelResult.parcel} />
            {this.showTransactionList(parcelResult.parcel, page)}
        </Container>
        )
    }

    private getBadgeClassNameByAction = (action: string) => {
        switch (action) {
            case "changeShardState":
                return "change-shard-state-action-back-color";
            case "payment":
                return "payment-action-back-color";
            case "setRegularKey":
                return "set-regular-key-action-back-color";
        }
        return "";
    }

    private getActionString = (action: string) => {
        switch (action) {
            case "changeShardState":
                return "ChangeShardState";
            case "payment":
                return "Payment";
            case "setRegularKey":
                return "SetRegularKey";
        }
        return "";
    }

    private showTransactionList = (parcel: ParcelDoc, page: number) => {
        if (Type.isChangeShardStateDoc(parcel.action)) {
            return (
                [
                    <div key="transaction-label" className="transaction-count-label">
                        <span className="blue-color">{(parcel.action as ChangeShardStateDoc).transactions.length} Transactions</span> in this Block
                    </div>,
                    <div key="parcel-transaction" className="mt-3">
                        <ParcelTransactionList transactions={(parcel.action as ChangeShardStateDoc).transactions.slice(0, page * this.itemPerPage)} />
                        {
                            page * this.itemPerPage < (parcel.action as ChangeShardStateDoc).transactions.length ?
                                <div className="mt-3">
                                    <div className="load-more-btn mx-auto">
                                        <a href="#" onClick={this.loadMore}>
                                            <h3>Load Transactions</h3>
                                        </a>
                                    </div>
                                </div>
                                : null
                        }
                    </div>
                ]
            )
        }
        return null;
    }

    private loadMore = (e: any) => {
        e.preventDefault();
        this.setState({ page: this.state.page + 1 })
    }

    private onPendingParcel = (pendingParcel: PendingParcelDoc) => {
        const parcelResult = {
            parcel: pendingParcel.parcel,
            status: pendingParcel.status
        }
        this.setState({ parcelResult });
    }

    private onPendingParcelNotExist = () => {
        this.setState({ notExistedInPendingParcel: true });
    }
    private onParcel = (parcel: ParcelDoc) => {
        const parcelResult = {
            parcel,
            status: "confirmed"
        }
        this.setState({ parcelResult });
    }

    private onParcelNotExist = () => {
        this.setState({ notExistedInBlock: true });
    }

    private onError = (e: any) => {
        console.log(e);
    };
}

export default Parcel;
