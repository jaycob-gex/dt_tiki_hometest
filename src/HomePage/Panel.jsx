import React from 'react';
import { Collapse, Button, CardBody, CardText, Card, Form, FormGroup, Label, Input } from 'reactstrap';

/*A panel that shows edit/delete buttons below a book container*/
class Panel extends React.Component {
    constructor(props) {
        super(props)

        const {book} = this.props

        this.state = { 
            collapse: false,
            name: book.name,
            author: book.author,
            description: book.description
        }
    }

    toggle = () => {
        this.setState(state => ({ collapse: !state.collapse }))
    }

    submit = () => {
        const {book} = this.props

        const newBook = {
            _id: book._id,
            name: this.state.name,
            author: this.state.author,
            description: this.state.description
        }

        //double call function
        this.props.handleUpdateBook(newBook)()
    }

    render() {
        const {user, book} = this.props

        //delete, edit buttons are only available for Admin user
        if (user.role === 'admin') {
            return (
                <div>
                {
                    book.deleting ? <Button color="secondary" disabled>Deleting...</Button>
                                : book.deleteError ? <span className="error"> - ERROR: {book.deleteError}</span>
                                                    : <span>{'\n'}<Button color="danger" onClick={this.props.handleDeleteBook(book._id)}>Delete</Button></span>
                }
                {
                    book.updating ? <Button color="secondary" disabled>Updating...</Button>
                                : book.updateError ? <span className="error"> - ERROR: {book.updateError}</span>
                                                    : <span style={{marginLeft: "3px"}}><Button color="primary" onClick={this.toggle}>Update</Button></span>
                }
                {
                    <Collapse isOpen={this.state.collapse}>
                        <Card body outline color="success">
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <Label for="name">Name</Label>
                                        <Input type="text" name="name" id="name" 
                                            placeholder={book.name} 
                                            defaultValue={book.name}
                                            onChange={e => this.setState({ name: e.target.value })}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="name">Author</Label>
                                        <Input type="text" name="author" id="author" 
                                            placeholder={book.author} 
                                            defaultValue={book.author}
                                            onChange={e => this.setState({ author: e.target.value })}/>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="name">Description</Label>
                                        <Input type="textarea" name="description" id="description" 
                                            placeholder={book.description} 
                                            defaultValue={book.author}
                                            onChange={e => this.setState({ description: e.target.value })}/>
                                    </FormGroup>
                                    <Button type="button" onClick={this.submit}>Submit</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Collapse>
                }
                </div>
            )
        } else {
            return (null)
        }
        
    }
}

export { Panel }