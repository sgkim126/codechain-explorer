import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.scss";

import Footer from "./components/footer/Footer";
import Header from "./components/header/Header/Header";
import ScrollToTop from "./components/util/ScrollToTop/ScrollToTop";
import Asset from "./pages/Asset/Asset";
import AssetTransferAddress from "./pages/AssetTransferAddress/AssetTransferAddress";
import Block from "./pages/Block/Block";
import Blocks from "./pages/Blocks/Blocks";
import Home from "./pages/Home/Home";
import NotFound from "./pages/NotFound/NotFound";
import PendingTransactions from "./pages/PendingTransactions/PendingTransactions";
import PlatformAddress from "./pages/PlatformAddress/PlatformAddress";
import Status from "./pages/Status/Status";
import Transaction from "./pages/Transaction/Transaction";
import Transactions from "./pages/Transactions/Transactions";
import { store } from "./redux/store";
// import RegisterServiceWorker from "./register_service_worker";

ReactDOM.render(
    <Provider store={store}>
        <Router basename={process.env.PUBLIC_URL}>
            <ScrollToTop>
                <div id="page">
                    <Header />
                    <div id="content">
                        <Switch>
                            <Route exact={true} path="/" component={Home} />
                            <Route path="/status" component={Status} />
                            <Route path="/block/:id" component={Block} />
                            <Route path="/asset/:assetType" component={Asset} />
                            <Route path="/tx/:hash" component={Transaction} />
                            <Route path="/addr-platform/:address" component={PlatformAddress} />
                            <Route path="/addr-asset/:address" component={AssetTransferAddress} />
                            <Route path="/txs" component={Transactions} />
                            <Route path="/pending-txs" component={PendingTransactions} />
                            <Route path="/blocks" component={Blocks} />
                            <Route component={NotFound} />
                        </Switch>
                        <ToastContainer autoClose={false} />
                    </div>
                    <Footer />
                </div>
            </ScrollToTop>
        </Router>
    </Provider>,
    document.getElementById("root") as HTMLElement
);

// RegisterServiceWorker();
