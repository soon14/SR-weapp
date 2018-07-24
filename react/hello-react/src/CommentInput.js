import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CommentInput extends Component{

    static propTypes = {
        onSubmit: PropTypes.func
    }

    constructor(){
        super();
        this.state={
            username:'',
            content:'',
        }
    }

    //组件挂载之前
    componentWillMount () {
        this._loadUsername()
    }

    // 组件挂载完成
    componentDidMount () {
        this.textarea.focus()
    }

    _loadUsername () {
        const username = localStorage.getItem('username')
        if (username) {
          this.setState({ username })
        }
    }

    _saveUsername (username) {
        localStorage.setItem('username', username)
    }

    handleUsernameChange (event) {
        this.setState({
          username: event.target.value
        })
    }

    handleContentChange (event) {
        this.setState({
          content: event.target.value
        })
    }

    // 失去焦点缓存数据
    handleUsernameBlur (event) {
        this._saveUsername(event.target.value)
    }

    handleSubmit () {
        if (this.props.onSubmit) {

            const { username, content } = this.state
            const createdTime = +new Date()
            this.props.onSubmit({
                username,
                content,
                createdTime,
            })

        }
        this.setState({ content: '' })
    }

    render(){
        return (
            <div className='comment-input'>
                <div className='comment-field'>
                    <span className='comment-field-name'>用户名：</span>
                    <div className='comment-field-input'>
                        <input value={this.state.username} onBlur={this.handleUsernameBlur.bind(this)} onChange={this.handleUsernameChange.bind(this)} />
                    </div>
                </div>
                <div className='comment-field'>
                    <span className='comment-field-name'>评论内容：</span>
                    <div className='comment-field-input'>
                        <textarea ref={(textarea) => this.textarea = textarea} value={this.state.content} onChange={this.handleContentChange.bind(this)} />
                    </div>
                </div>
                <div className='comment-field-button'>
                    <button  onClick={this.handleSubmit.bind(this)}>
                        发布
                    </button>
                </div>
          </div>
        )
    }
}

export default CommentInput