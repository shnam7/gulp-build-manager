type MyProps = { msg: string };

class MyComponent extends React.Component<MyProps> {
    constructor(props: MyProps) { super(props); }

    render() {
        return <h1 className='title'>{this.props.msg}</h1>
    }
}

ReactDOM.render(<MyComponent msg="Hello, React!"/>, document.getElementById('react-canvas'));
