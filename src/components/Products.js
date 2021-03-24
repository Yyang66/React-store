import React from 'react';
import axios from 'commons/axios';
import ToolBox from 'components/ToolBox';
import Product from 'components/Product';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Panel from 'components/Panel';
import AddInventory from 'components/AddInventory';

class Products extends React.Component {
	state = {
		products: [],
		sourceProducts: [],
		cartNum: 0
	};
	componentDidMount() {
		// fetch('http://localhost:3003/products')
		// 	.then((response) => response.json())
		// 	.then((data) => {
		// 		console.log(data);
		// 		this.setState({
		// 			products: data
		// 		});
		// 	});
		axios.get('/products').then((response) => {
			console.log(response.data);
			this.setState({
				products: response.data,
				sourceProducts: response.data
			});
		});
		this.updateCartNum();
	}
	search = (text) => {
		console.log(text);
		//get new array
		let _products = [...this.state.sourceProducts];
		//filter
		_products = _products.filter((p) => {
			const matchArray = p.name.match(new RegExp(text, 'gi'));
			return !!matchArray;
		});
		//set state
		this.setState({
			products: _products
		});
	};
	// add
	toAdd = () => {
		Panel.open({
			component: AddInventory,
			callback: (data) => {
				if (data) {
					this.add(data);
				}
			}
		});
	};
	add = (product) => {
		const _products = [...this.state.products];
		_products.push(product);
		const _sProducts = [...this.state.sourceProducts];
		_sProducts.push(product);
		this.setState({
			products: _products,
			sourceProducts: _sProducts
		});
	};
	update = (product) => {
		const _products = [...this.state.products];
		const _index = _products.findIndex((p) => p.id === product.id);
		_products.splice(_index, 1, product);
		const _sProducts = [...this.state.sourceProducts];
		const _sIndex = _sProducts.findIndex((p) => p.id === product.id);
		_sProducts.splice(_sIndex, 1, product);
		this.setState({
			products: _products,
			sourceProducts: _sProducts
		});
	};
	delete = (id) => {
		const _products = this.state.products.filter((p) => p.id !== id);
		const _sProducts = this.state.sourceProducts.filter((p) => p.id !== id);
		this.setState({
			products: _products,
			sourceProducts: _sProducts
		});
	};
	updateCartNum = async () => {
		const num = await this.initCartNum();
		this.setState({
			cartNum: num
		});
	};
	initCartNum = async () => {
		const user = global.auth.getUser() || {};
		const res = await axios.get(`/carts`, {
			params: {
				userId: user.email
			}
		});
		const carts = res.data || [];
		const cartNum = carts
			.map((c) => c.mount)
			.reduce((accumulator, value) => accumulator + value, 0);
		return cartNum || 0;
	};

	render() {
		return (
			<div>
				<ToolBox
					search={this.search}
					cartNum={this.state.cartNum}
				></ToolBox>
				<div className="products">
					<div className="columns is-multiline is-desktop">
						{/* animation */}
						<TransitionGroup component={null}>
							{this.state.products.map((p) => {
								return (
									<CSSTransition
										classNames="product-fade"
										timeout={300}
										key={p.id}
									>
										<div className="column is-3" key={p.id}>
											<Product
												product={p}
												update={this.update}
												delete={this.delete}
												updateCartNum={
													this.updateCartNum
												}
											/>
										</div>
									</CSSTransition>
								);
							})}
						</TransitionGroup>
					</div>
					{/* add */}
					{(global.auth.getUser() || {}).type === 1 && (
						<button
							className="button is-primary add-btn"
							onClick={this.toAdd}
						>
							add
						</button>
					)}
				</div>
			</div>
		);
	}
}

export default Products;
