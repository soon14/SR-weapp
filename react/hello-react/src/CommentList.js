import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Comment from './Comment'

class CommentList extends Component {

    static propTypes = {
        comments: PropTypes.array,
        onDeleteComment: PropTypes.func
    }
    
    static defaultProps = {
        comments: []
    }

    handleDeleteComment (index) {
        const {onDeleteComment} = this.props
        if (onDeleteComment) {
          onDeleteComment(index)
        }
    }

    render() {
        return (
        <div>
            {this.props.comments.map((comment, i) =>
            <Comment  
                comment={comment}
                key={i}
                index={i}
                onDeleteComment={this.handleDeleteComment.bind(this)}  />
            )}
        </div>
        )
    }
}

export default CommentList