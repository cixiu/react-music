const searchHOC = (WrappedComponent) => {
    class SearchHOC extends WrappedComponent {
        // 将热门搜索词添加到搜索框中
        addQuery = (query) => {
            this.SearchBox.setQuery(query);
        }
        // 将函数传个seach-box组件，当search-box中query改变时，search组件中的query也跟着改变
        queryChange = (query) => {
            this.setState({
                query
            })
        }
        // 使search-box中的input失去焦点
        inputBlur = () => {
            this.SearchBox.blur();
        }
        // 存储选中的搜索词到localStorage中
        saveSearch = () => {
            this.props.saveSearch(this.state.query);
        }
        // 删除一个搜索历史结果
        deleteOne = (item) => {
            this.props.deleteSearch(item);
        }
        
        render() {
            return super.render()
        }
    }

    SearchHOC.displayName = `SearchHOC(${getDisplayName(WrappedComponent)})`

    return SearchHOC
}

function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default searchHOC